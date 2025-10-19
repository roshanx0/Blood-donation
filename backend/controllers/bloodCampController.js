const BloodCamp = require("../models/BloodCamp");
const Organization = require("../models/Organization");
const User = require("../models/User");

// @desc    Create new blood camp
// @route   POST /api/camps
// @access  Private (Organization only)
exports.createBloodCamp = async (req, res) => {
  try {
    console.log("Create camp request from user:", req.user?.id);
    console.log("User type:", req.userType);
    console.log("Request body:", req.body);

    const {
      title,
      description,
      date,
      startTime,
      endTime,
      venue,
      address,
      city,
      expectedDonors,
      facilities,
      requirements,
      bloodBankPartner,
      contactPerson,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !date ||
      !startTime ||
      !endTime ||
      !venue ||
      !address ||
      !city ||
      !expectedDonors ||
      !contactPerson
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user is organization
    if (req.userType !== "organization") {
      return res.status(403).json({
        success: false,
        message: "Only organizations can create blood camps",
      });
    }

    // Get organization details
    const organization = await Organization.findById(req.user.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    console.log(
      "Organization found:",
      organization.name,
      "Verified:",
      organization.isVerified
    );

    if (!organization.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Your organization must be verified to create blood camps",
      });
    }

    console.log("Creating camp with data:", {
      title,
      date,
      organizer: req.user.id,
    });

    const camp = await BloodCamp.create({
      title,
      description,
      date,
      startTime,
      endTime,
      venue,
      address,
      city,
      expectedDonors,
      facilities: facilities || [],
      requirements,
      bloodBankPartner: bloodBankPartner || null,
      contactPerson,
      organizer: req.user.id,
      organizerDetails: {
        name: organization.name,
        type: organization.type,
        phone: organization.phone,
        email: organization.email,
      },
    });

    console.log("Camp created successfully:", camp._id);

    res.status(201).json({
      success: true,
      message: "Blood camp created successfully. Awaiting admin approval.",
      data: camp,
    });
  } catch (error) {
    console.error("Create blood camp error:", error);
    console.error("Error stack:", error.stack);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating blood camp",
    });
  }
};

// @desc    Get all blood camps (with filters)
// @route   GET /api/camps
// @access  Public
exports.getAllBloodCamps = async (req, res) => {
  try {
    const { city, status, search } = req.query;

    let query = { isApproved: true };

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    // Don't apply status filter in query - we'll filter after updating statuses
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { venue: { $regex: search, $options: "i" } },
      ];
    }

    let camps = await BloodCamp.find(query)
      .populate("organizer", "name type email phone")
      .populate("bloodBankPartner", "name phone address")
      .sort({ date: 1 });

    // Update status for each camp based on current date
    camps.forEach((camp) => {
      camp.updateStatus();
    });

    // Apply status filter AFTER updating statuses
    if (status) {
      camps = camps.filter((camp) => camp.status === status);
    }

    res.status(200).json({
      success: true,
      count: camps.length,
      data: camps,
    });
  } catch (error) {
    console.error("Get blood camps error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single blood camp
// @route   GET /api/camps/:id
// @access  Public
exports.getBloodCampById = async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id)
      .populate("organizer", "name type email phone address city")
      .populate("bloodBankPartner", "name phone address city")
      .populate("registeredDonors.donor", "name email phone bloodType city");

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Blood camp not found",
      });
    }

    // Update status based on current date
    camp.updateStatus();

    res.status(200).json({
      success: true,
      data: camp,
    });
  } catch (error) {
    console.error("Get blood camp error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Register donor for blood camp
// @route   POST /api/camps/:id/register
// @access  Private (Donor only)
exports.registerForCamp = async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Blood camp not found",
      });
    }

    if (!camp.isApproved) {
      return res.status(400).json({
        success: false,
        message: "This camp is not approved yet",
      });
    }

    if (camp.status === "completed" || camp.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: `Cannot register for ${camp.status} camp`,
      });
    }

    if (camp.isFull()) {
      return res.status(400).json({
        success: false,
        message: "This camp has reached maximum capacity",
      });
    }

    if (camp.isUserRegistered(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this camp",
      });
    }

    camp.registeredDonors.push({
      donor: req.user.id,
      registeredAt: Date.now(),
    });

    await camp.save();

    res.status(200).json({
      success: true,
      message: "Successfully registered for blood camp",
      data: camp,
    });
  } catch (error) {
    console.error("Register for camp error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Unregister donor from blood camp
// @route   POST /api/camps/:id/unregister
// @access  Private (Donor only)
exports.unregisterFromCamp = async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Blood camp not found",
      });
    }

    if (!camp.isUserRegistered(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You are not registered for this camp",
      });
    }

    // Don't allow unregistering from completed or ongoing camps
    if (camp.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot unregister from completed camp",
      });
    }

    if (camp.status === "ongoing") {
      return res.status(400).json({
        success: false,
        message: "Cannot unregister from ongoing camp",
      });
    }

    // Remove the donor from registeredDonors array
    camp.registeredDonors = camp.registeredDonors.filter(
      (registration) => registration.donor.toString() !== req.user.id
    );

    await camp.save();

    res.status(200).json({
      success: true,
      message: "Successfully unregistered from blood camp",
      data: camp,
    });
  } catch (error) {
    console.error("Unregister from camp error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get camps created by organization
// @route   GET /api/camps/my-camps
// @access  Private (Organization only)
exports.getMyCamps = async (req, res) => {
  try {
    const camps = await BloodCamp.find({ organizer: req.user.id })
      .populate("bloodBankPartner", "name phone")
      .populate("registeredDonors.donor", "name phone email bloodType city")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: camps.length,
      data: camps,
    });
  } catch (error) {
    console.error("Get my camps error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get camps registered by user
// @route   GET /api/camps/my-registrations
// @access  Private (User only)
exports.getMyRegistrations = async (req, res) => {
  try {
    const camps = await BloodCamp.find({
      "registeredDonors.donor": req.user.id,
    })
      .populate("organizer", "name type phone")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: camps.length,
      data: camps,
    });
  } catch (error) {
    console.error("Get my registrations error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update blood camp
// @route   PUT /api/camps/:id
// @access  Private (Organization only)
exports.updateBloodCamp = async (req, res) => {
  try {
    let camp = await BloodCamp.findById(req.params.id);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Blood camp not found",
      });
    }

    // Check if user is the organizer
    if (camp.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this camp",
      });
    }

    camp = await BloodCamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Blood camp updated successfully",
      data: camp,
    });
  } catch (error) {
    console.error("Update blood camp error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Delete blood camp
// @route   DELETE /api/camps/:id
// @access  Private (Organization only)
exports.deleteBloodCamp = async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Blood camp not found",
      });
    }

    // Check if user is the organizer
    if (camp.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this camp",
      });
    }

    await camp.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blood camp deleted successfully",
    });
  } catch (error) {
    console.error("Delete blood camp error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Verify attendance and create donation record
// @route   POST /api/camps/:id/verify-attendance
// @access  Private (Organization only)
exports.verifyAttendance = async (req, res) => {
  try {
    const { id: campId } = req.params;
    const { userId, quantity = 450 } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find camp and populate registered donors
    const camp = await BloodCamp.findById(campId).populate(
      "registeredDonors.donor",
      "name email phone bloodType city"
    );

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Blood camp not found",
      });
    }

    // Check if requester is the camp organizer
    if (camp.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only the camp organizer can verify attendance",
      });
    }

    // Find the registration
    const registrationIndex = camp.registeredDonors.findIndex(
      (r) => r.donor._id.toString() === userId
    );

    if (registrationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Donor is not registered for this camp",
      });
    }

    const registration = camp.registeredDonors[registrationIndex];

    // Check if already marked attended
    if (registration.attended) {
      return res.status(400).json({
        success: false,
        message: "Attendance already verified for this donor",
        alreadyVerified: true,
      });
    }

    // Get user details
    const User = require("../models/User");
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Mark attendance
    camp.registeredDonors[registrationIndex].attended = true;
    await camp.save();

    // Create donation history record
    const DonationHistory = require("../models/DonationHistory");
    const donation = await DonationHistory.create({
      userId: user._id,
      location: camp.venue,
      date: camp.date,
      quantity: quantity,
      bloodType: user.bloodType,
      status: "completed",
      campId: camp._id,
      notes: `Donated at ${camp.title}`,
    });

    // Update user stats
    user.lastDonationDate = new Date();
    user.totalDonations = (user.totalDonations || 0) + 1;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Attendance verified and donation recorded successfully",
      data: {
        donor: {
          name: user.name,
          bloodType: user.bloodType,
          email: user.email,
          phone: user.phone,
        },
        donation: donation,
        camp: {
          title: camp.title,
          date: camp.date,
          venue: camp.venue,
        },
      },
    });
  } catch (error) {
    console.error("Verify attendance error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while verifying attendance",
    });
  }
};

// @desc    Get camps registered by current user
// @route   GET /api/camps/my-registered-camps
// @access  Private (User only)
exports.getMyRegisteredCamps = async (req, res) => {
  try {
    // Find all camps where current user is registered
    const camps = await BloodCamp.find({
      "registeredDonors.donor": req.user.id,
    })
      .populate("organizer", "name type")
      .populate("bloodBankPartner", "name")
      .sort({ date: 1 }); // Sort by date ascending

    // Add registration info to each camp
    const campsWithRegistrationInfo = camps.map((camp) => {
      const campObj = camp.toObject();
      const registration = camp.registeredDonors.find(
        (r) => r.donor.toString() === req.user.id
      );

      // Get user details for QR generation
      const User = require("../models/User");

      return {
        ...campObj,
        registrationInfo: {
          donor: req.user.id,
          registeredAt: registration?.registeredAt,
          attended: registration?.attended || false,
        },
      };
    });

    res.status(200).json({
      success: true,
      count: campsWithRegistrationInfo.length,
      data: campsWithRegistrationInfo,
    });
  } catch (error) {
    console.error("Get my registered camps error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching registered camps",
    });
  }
};
