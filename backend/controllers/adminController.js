const BloodBank = require('../models/BloodBank');
const User = require('../models/User');

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
    console.error('Get pending blood banks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending blood banks',
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
        message: 'Blood bank not found',
      });
    }

    bloodBank.isApproved = true;
    await bloodBank.save();

    res.status(200).json({
      success: true,
      message: 'Blood bank approved successfully',
      bloodBank,
    });
  } catch (error) {
    console.error('Approve blood bank error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving blood bank',
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
        message: 'Blood bank not found',
      });
    }

    await bloodBank.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blood bank registration rejected',
    });
  } catch (error) {
    console.error('Reject blood bank error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting blood bank',
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
    console.error('Get all blood banks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blood banks',
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
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
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
          _id: '$bloodType',
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
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
    });
  }
};