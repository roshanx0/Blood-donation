const Request = require("../models/Request");
const User = require("../models/User");
const BloodBank = require("../models/BloodBank");
const Organization = require("../models/Organization");

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
  try {
    const { days = 7 } = req.query; // Default last 7 days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // 1. Requests trend over time
    const requestsTrend = await Request.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%m/%d", date: "$createdAt" },
          },
          total: { $sum: 1 },
          fulfilled: {
            $sum: { $cond: [{ $eq: ["$status", "fulfilled"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          total: 1,
          fulfilled: 1,
          pending: 1,
          cancelled: 1,
        },
      },
    ]);

    // 2. Blood type distribution
    const bloodTypeDistribution = await Request.aggregate([
      {
        $group: {
          _id: "$bloodType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          bloodType: "$_id",
          count: 1,
        },
      },
    ]);

    // 3. Request status overview
    const statusOverview = await Request.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);

    // 4. City-wise demand
    const cityDemand = await Request.aggregate([
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 }, // Top 10 cities
      {
        $project: {
          _id: 0,
          city: "$_id",
          count: 1,
        },
      },
    ]);

    // 5. Recent activity stats
    const totalUsers = await User.countDocuments();
    const totalBloodBanks = await BloodBank.countDocuments({
      isApproved: true,
    });
    const pendingBloodBanks = await BloodBank.countDocuments({
      isApproved: false,
    });
    const totalOrganizations = await Organization.countDocuments({
      isVerified: true,
    });
    const totalRequests = await Request.countDocuments();
    const activeRequests = await Request.countDocuments({ status: "pending" });

    res.status(200).json({
      success: true,
      analytics: {
        requestsTrend,
        bloodTypeDistribution,
        statusOverview,
        cityDemand,
        summary: {
          totalUsers,
          totalBloodBanks,
          pendingBloodBanks,
          totalOrganizations,
          totalRequests,
          activeRequests,
        },
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching analytics data",
      error: error.message,
    });
  }
};
