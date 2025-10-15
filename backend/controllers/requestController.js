const Request = require("../models/Request");
const User = require("../models/User");
const BloodBank = require("../models/BloodBank");

// @desc    Create a blood request
// @route   POST /api/requests
// @access  Private (User or BloodBank)
exports.createRequest = async (req, res) => {
  try {
    const {
      bloodType,
      quantity,
      urgency,
      city,
      hospital,
      patientName,
      contactNumber,
      reason,
    } = req.body;

    // Get the requester's city if not provided
    const requestCity = city || req.user.city;

    const request = await Request.create({
      bloodType,
      quantity,
      urgency,
      city: requestCity,
      hospital,
      patientName,
      contactNumber,
      reason,
      requestedBy: req.user._id,
      requesterModel: req.userType === "user" ? "User" : "BloodBank",
    });

    // Populate requester details
    await request.populate("requestedBy", "name email phone");

    res.status(201).json({
      success: true,
      message: "Blood request created successfully",
      request,
    });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating blood request",
    });
  }
};

// @desc    Get all requests (with filters)
// @route   GET /api/requests
// @access  Private
exports.getAllRequests = async (req, res) => {
  try {
    const { bloodType, city, urgency, status } = req.query;

    let query = {};

    // Build query based on filters
    if (bloodType) query.bloodType = bloodType;
    if (city) query.city = new RegExp(city, "i"); // Case-insensitive search
    if (urgency) query.urgency = urgency;
    if (status) query.status = status;

    const requests = await Request.find(query)
      .populate("requestedBy", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get all requests error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching requests",
    });
  }
};

// @desc    Get requests for the same city and blood type as logged-in user
// Blood compatibility helper function
// Returns array of blood types that a donor can donate to
const getCompatibleBloodTypes = (donorBloodType) => {
  const compatibility = {
    "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], // Universal donor
    "O+": ["O+", "A+", "B+", "AB+"],
    "A-": ["A-", "A+", "AB-", "AB+"],
    "A+": ["A+", "AB+"],
    "B-": ["B-", "B+", "AB-", "AB+"],
    "B+": ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"], // Universal receiver can only donate to AB+
  };
  return compatibility[donorBloodType] || [donorBloodType];
};

// @route   GET /api/requests/matching
// @access  Private
exports.getMatchingRequests = async (req, res) => {
  try {
    // For users, match compatible blood types and city
    // For blood banks, show all requests in their city
    let query = {
      status: "pending",
      city: req.user.city,
    };

    if (req.userType === "user") {
      // Get compatible blood types for this donor
      const compatibleTypes = getCompatibleBloodTypes(req.user.bloodType);
      query.bloodType = { $in: compatibleTypes };
    }

    const requests = await Request.find(query)
      .populate("requestedBy", "name email phone")
      .sort({ urgency: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get matching requests error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching matching requests",
    });
  }
};

// @desc    Get my requests
// @route   GET /api/requests/my-requests
// @access  Private
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requestedBy: req.user._id })
      .populate("requestedBy", "name email phone")
      .populate("responses.responderId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get my requests error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching your requests",
    });
  }
};

// @desc    Get single request by ID
// @route   GET /api/requests/:id
// @access  Private
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("requestedBy", "name email phone address city")
      .populate("responses.responderId", "name email phone");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("Get request by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching request",
    });
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private (Request owner only)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Check if user is the owner of the request
    if (request.requestedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this request",
      });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: "Request status updated successfully",
      request,
    });
  } catch (error) {
    console.error("Update request status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating request status",
    });
  }
};

// @desc    Respond to a request
// @route   POST /api/requests/:id/respond
// @access  Private
exports.respondToRequest = async (req, res) => {
  try {
    const { message } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Check if already responded
    const alreadyResponded = request.responses.some(
      (response) => response.responderId.toString() === req.user._id.toString()
    );

    if (alreadyResponded) {
      return res.status(400).json({
        success: false,
        message: "You have already responded to this request",
      });
    }

    request.responses.push({
      responderId: req.user._id,
      responderModel: req.userType === "user" ? "User" : "BloodBank",
      message,
    });

    await request.save();
    await request.populate("responses.responderId", "name email phone");

    res.status(200).json({
      success: true,
      message: "Response added successfully",
      request,
    });
  } catch (error) {
    console.error("Respond to request error:", error);
    res.status(500).json({
      success: false,
      message: "Error responding to request",
    });
  }
};

// @desc    Delete a request
// @route   DELETE /api/requests/:id
// @access  Private (Request owner only)
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Check if user is the owner of the request
    if (request.requestedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this request",
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    console.error("Delete request error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting request",
    });
  }
};
