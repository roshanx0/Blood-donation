const Organization = require("../models/Organization");
const { generateToken } = require("../utils/generateToken");

// @desc    Register new organization
// @route   POST /api/auth/organization/register
// @access  Public
exports.registerOrganization = async (req, res) => {
  try {
    const {
      name,
      type,
      email,
      password,
      phone,
      address,
      city,
      registrationNumber,
      contactPerson,
      established,
      description,
    } = req.body;

    // Check if organization already exists
    const organizationExists = await Organization.findOne({ email });
    if (organizationExists) {
      return res.status(400).json({
        success: false,
        message: "Organization with this email already exists",
      });
    }

    // Check if registration number already exists
    const regNumberExists = await Organization.findOne({ registrationNumber });
    if (regNumberExists) {
      return res.status(400).json({
        success: false,
        message: "Registration number already in use",
      });
    }

    // Create organization
    const organization = await Organization.create({
      name,
      type,
      email,
      password,
      phone,
      address,
      city,
      registrationNumber,
      contactPerson,
      established,
      description,
    });

    res.status(201).json({
      success: true,
      message:
        "Organization registered successfully. Awaiting admin verification.",
      data: {
        organization: {
          _id: organization._id,
          name: organization.name,
          type: organization.type,
          email: organization.email,
          phone: organization.phone,
          city: organization.city,
          isVerified: organization.isVerified,
          role: organization.role,
        },
        token: generateToken(organization._id, "Organization"),
      },
    });
  } catch (error) {
    console.error("Organization registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during registration",
    });
  }
};

// @desc    Login organization
// @route   POST /api/auth/organization/login
// @access  Public
exports.loginOrganization = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for organization:", email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if organization exists and select password
    const organization = await Organization.findOne({ email }).select(
      "+password"
    );

    if (!organization) {
      console.log("Organization not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("Organization found, checking password...");

    // Check password
    const isPasswordValid = await organization.comparePassword(password);

    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("Login successful for:", organization.name);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        organization: {
          _id: organization._id,
          name: organization.name,
          type: organization.type,
          email: organization.email,
          phone: organization.phone,
          address: organization.address,
          city: organization.city,
          registrationNumber: organization.registrationNumber,
          contactPerson: organization.contactPerson,
          isVerified: organization.isVerified,
          role: organization.role,
        },
        token: generateToken(organization._id, "Organization"),
      },
    });
  } catch (error) {
    console.error("Organization login error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during login",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Get current organization
// @route   GET /api/auth/organization/me
// @access  Private
exports.getCurrentOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.user.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    console.error("Get organization error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
