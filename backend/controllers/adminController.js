const BloodBank = require("../models/BloodBank");
const User = require("../models/User");

// @desc    Get all pending blood bank registrations
// @route   GET /api/admin/bloodbanks/pending
// @access  Private/Admin
exports.getPendingBloodBanks = async (req, res) => {
  try {
    const bloodBanks = await BloodBank.find({ isApproved: false }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: bloodBanks.length,
      bloodBanks,
    });
  } catch (error) {
    console.error("Get pending blood banks error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching pending blood banks",
    });
  }
};

// @desc    Approve blood bank registration
// @route   PUT /api/admin/bloodbanks/:id/approve
// @access  Private/Admin
exports.approveBloodBank = async (req, res) => {
  try {
    const bloodBank = await BloodBank.findById(req.params.id);

    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found",
      });
    }

    bloodBank.isApproved = true;
    await bloodBank.save();

    res.status(200).json({
      success: true,
      message: "Blood bank approved successfully",
      bloodBank,
    });
  } catch (error) {
    console.error("Approve blood bank error:", error);
    res.status(500).json({
      success: false,
      message: "Error approving blood bank",
    });
  }
};

// @desc    Reject blood bank registration
// @route   DELETE /api/admin/bloodbanks/:id/reject
// @access  Private/Admin
exports.rejectBloodBank = async (req, res) => {
  try {
    const bloodBank = await BloodBank.findById(req.params.id);

    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found",
      });
    }

    await bloodBank.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blood bank registration rejected",
    });
  } catch (error) {
    console.error("Reject blood bank error:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting blood bank",
    });
  }
};

// @desc    Get all approved blood banks
// @route   GET /api/admin/bloodbanks
// @access  Private/Admin
exports.getAllBloodBanks = async (req, res) => {
  try {
    const bloodBanks = await BloodBank.find({ isApproved: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: bloodBanks.length,
      bloodBanks,
    });
  } catch (error) {
    console.error("Get all blood banks error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blood banks",
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBloodBanks = await BloodBank.countDocuments({
      isApproved: true,
    });
    const pendingBloodBanks = await BloodBank.countDocuments({
      isApproved: false,
    });

    // Get blood type distribution
    const bloodTypeDistribution = await User.aggregate([
      {
        $group: {
          _id: "$bloodType",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBloodBanks,
        pendingBloodBanks,
        bloodTypeDistribution,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
    });
  }
};

// Organization Management

// @desc    Get all organizations
// @route   GET /api/admin/organizations
// @access  Private/Admin
exports.getAllOrganizations = async (req, res) => {
  try {
    const Organization = require("../models/Organization");
    const organizations = await Organization.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations,
    });
  } catch (error) {
    console.error("Get organizations error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching organizations",
    });
  }
};

// @desc    Verify/Unverify organization
// @route   PUT /api/admin/organizations/:id/verify
// @access  Private/Admin
exports.toggleOrganizationVerification = async (req, res) => {
  try {
    const Organization = require("../models/Organization");
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    organization.isVerified = !organization.isVerified;
    await organization.save();

    res.status(200).json({
      success: true,
      message: `Organization ${
        organization.isVerified ? "verified" : "unverified"
      } successfully`,
      data: organization,
    });
  } catch (error) {
    console.error("Toggle organization verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating organization",
    });
  }
};

// @desc    Delete organization
// @route   DELETE /api/admin/organizations/:id
// @access  Private/Admin
exports.deleteOrganization = async (req, res) => {
  try {
    const Organization = require("../models/Organization");
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    await organization.deleteOne();

    res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    console.error("Delete organization error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting organization",
    });
  }
};

// Blood Camp Management

// @desc    Get all blood camps (including unapproved)
// @route   GET /api/admin/camps
// @access  Private/Admin
exports.getAllCamps = async (req, res) => {
  try {
    const BloodCamp = require("../models/BloodCamp");
    const camps = await BloodCamp.find()
      .populate("organizer", "name type email phone isVerified")
      .populate("bloodBankPartner", "name city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: camps.length,
      data: camps,
    });
  } catch (error) {
    console.error("Get camps error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching camps",
    });
  }
};

// @desc    Approve/Unapprove blood camp
// @route   PUT /api/admin/camps/:id/approve
// @access  Private/Admin
exports.toggleCampApproval = async (req, res) => {
  try {
    const BloodCamp = require("../models/BloodCamp");
    const camp = await BloodCamp.findById(req.params.id);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Blood camp not found",
      });
    }

    camp.isApproved = !camp.isApproved;
    await camp.save();

    res.status(200).json({
      success: true,
      message: `Blood camp ${
        camp.isApproved ? "approved" : "unapproved"
      } successfully`,
      data: camp,
    });
  } catch (error) {
    console.error("Toggle camp approval error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating camp",
    });
  }
};

// @desc    Delete blood camp
// @route   DELETE /api/admin/camps/:id
// @access  Private/Admin
exports.deleteCamp = async (req, res) => {
  try {
    const BloodCamp = require("../models/BloodCamp");
    const camp = await BloodCamp.findById(req.params.id);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Blood camp not found",
      });
    }

    await camp.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blood camp deleted successfully",
    });
  } catch (error) {
    console.error("Delete camp error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting camp",
    });
  }
};
