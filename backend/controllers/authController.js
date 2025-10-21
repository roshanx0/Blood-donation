const User = require("../models/User");
const BloodBank = require("../models/BloodBank");
const { sendTokenResponse } = require("../utils/generateToken");

// @desc    Register user
// @route   POST /api/auth/register/user
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, bloodType, city } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      bloodType,
      city,
    });

    sendTokenResponse(user, 201, res, "User");
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error registering user",
    });
  }
};

// @desc    Register blood bank
// @route   POST /api/auth/register/bloodbank
// @access  Public
exports.registerBloodBank = async (req, res) => {
  try {
    const { name, email, password, phone, address, city, licenseNumber } =
      req.body;

    // Check if blood bank already exists
    const existingBloodBank = await BloodBank.findOne({
      $or: [{ email }, { licenseNumber }],
    });

    if (existingBloodBank) {
      return res.status(400).json({
        success: false,
        message: "Blood bank with this email or license number already exists",
      });
    }

    // Create blood bank (not approved by default)
    const bloodBank = await BloodBank.create({
      name,
      email,
      password,
      phone,
      address,
      city,
      licenseNumber,
      isApproved: false,
    });

    res.status(201).json({
      success: true,
      message: "Blood bank registration submitted. Waiting for admin approval.",
      bloodBank,
    });
  } catch (error) {
    console.error("Register blood bank error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error registering blood bank",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login/user
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    sendTokenResponse(user, 200, res, "User");
  } catch (error) {
    console.error("Login user error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
};

// @desc    Login blood bank
// @route   POST /api/auth/login/bloodbank
// @access  Public
exports.loginBloodBank = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find blood bank and include password
    const bloodBank = await BloodBank.findOne({ email }).select("+password");

    if (!bloodBank) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if blood bank is active
    if (!bloodBank.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // Check password
    const isPasswordMatch = await bloodBank.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if approved
    if (!bloodBank.isApproved) {
      return res.status(403).json({
        success: false,
        message:
          "Your blood bank registration is pending admin approval. You will be able to login once approved.",
      });
    }

    sendTokenResponse(bloodBank, 200, res, "BloodBank");
  } catch (error) {
    console.error("Login blood bank error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
      userType: req.userType,
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userType = req.userType;

    // Determine which model to use based on user type
    let Model;
    let allowedFields = [];

    if (userType === "user") {
      Model = User;
      allowedFields = ["name", "phone", "city", "bloodType"];
    } else if (userType === "bloodbank") {
      Model = BloodBank;
      allowedFields = ["name", "phone", "address", "city"];
    } else if (userType === "organization") {
      const Organization = require("../models/Organization");
      Model = Organization;
      allowedFields = [
        "name",
        "phone",
        "address",
        "city",
        "description",
        "contactPerson",
      ];
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user type",
      });
    }

    // Filter only allowed fields
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Update user
    const updatedUser = await Model.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating profile",
    });
  }
};

// @desc    Get donation history
// @route   GET /api/auth/donation-history
// @access  Private (Users only)
exports.getDonationHistory = async (req, res) => {
  try {
    const DonationHistory = require("../models/DonationHistory");

    // Get donation history for the user
    const donations = await DonationHistory.find({ userId: req.user._id })
      .sort({ date: -1 })
      .populate("campId", "name")
      .populate("bloodBankId", "name");

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error("Get donation history error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching donation history",
    });
  }
};

// @desc    Add donation record (RESTRICTED - Only for blood banks/organizations)
// @route   POST /api/auth/donation-history
// @access  Private (Blood Banks and Organizations only - NOT for users)
// Note: This function should not be exposed to regular users
// Donations should only be recorded via blood bank QR scanning or camp attendance verification
exports.addDonationRecord = async (req, res) => {
  try {
    // Prevent regular users from manually adding donation records
    if (req.userType === "user") {
      return res.status(403).json({
        success: false,
        message: "Users cannot manually add donation records. Donations must be verified by blood banks or camp organizers.",
      });
    }

    const DonationHistory = require("../models/DonationHistory");
    const { userId, location, date, quantity, bloodType, notes, campId, bloodBankId } =
      req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const donation = await DonationHistory.create({
      userId: userId,
      location,
      date: date || Date.now(),
      quantity: quantity || 450,
      bloodType: bloodType,
      notes,
      campId,
      bloodBankId,
      status: "completed",
    });

    res.status(201).json({
      success: true,
      message: "Donation record added successfully",
      donation,
    });
  } catch (error) {
    console.error("Add donation record error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error adding donation record",
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging out",
    });
  }
};

// @desc    Get user by ID (for blood banks to view donor info)
// @route   GET /api/users/:id
// @access  Private (Blood Bank only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
    });
  }
};
