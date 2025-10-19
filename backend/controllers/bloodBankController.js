const BloodBank = require("../models/BloodBank");

// @desc    Update blood bank inventory
// @route   PUT /api/bloodbanks/inventory
// @access  Private/BloodBank
exports.updateInventory = async (req, res) => {
  try {
    const { inventory } = req.body;

    const bloodBank = await BloodBank.findById(req.user._id);

    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found",
      });
    }

    // Update inventory
    bloodBank.inventory = inventory;
    await bloodBank.save();

    res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      bloodBank,
    });
  } catch (error) {
    console.error("Update inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating inventory",
    });
  }
};

// @desc    Get blood bank inventory
// @route   GET /api/bloodbanks/:id/inventory
// @access  Public
exports.getInventory = async (req, res) => {
  try {
    const bloodBank = await BloodBank.findById(req.params.id).select(
      "name city inventory"
    );

    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found",
      });
    }

    // Initialize inventory if empty
    if (!bloodBank.inventory || bloodBank.inventory.length === 0) {
      bloodBank.inventory = [
        { bloodType: "A+", quantity: 0 },
        { bloodType: "A-", quantity: 0 },
        { bloodType: "B+", quantity: 0 },
        { bloodType: "B-", quantity: 0 },
        { bloodType: "AB+", quantity: 0 },
        { bloodType: "AB-", quantity: 0 },
        { bloodType: "O+", quantity: 0 },
        { bloodType: "O-", quantity: 0 },
      ];
      await bloodBank.save();
    }

    res.status(200).json({
      success: true,
      inventory: bloodBank.inventory,
      bloodBank,
    });
  } catch (error) {
    console.error("Get inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching inventory",
    });
  }
};

// @desc    Get all approved blood banks
// @route   GET /api/bloodbanks
// @access  Public
exports.getAllBloodBanks = async (req, res) => {
  try {
    const { city, bloodType } = req.query;

    let query = { isApproved: true, isActive: true };

    if (city) {
      query.city = new RegExp(city, "i");
    }

    let bloodBanks = await BloodBank.find(query).select("-password");

    // Filter by blood type availability if specified
    if (bloodType) {
      bloodBanks = bloodBanks.filter((bank) => {
        const bloodTypeInventory = bank.inventory.find(
          (item) => item.bloodType === bloodType
        );
        return bloodTypeInventory && bloodTypeInventory.quantity > 0;
      });
    }

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

// @desc    Get blood bank profile
// @route   GET /api/bloodbanks/profile
// @access  Private/BloodBank
exports.getProfile = async (req, res) => {
  try {
    const bloodBank = await BloodBank.findById(req.user._id).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      bloodBank,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
};

// @desc    Update blood bank profile
// @route   PUT /api/bloodbanks/profile
// @access  Private/BloodBank
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city } = req.body;

    const bloodBank = await BloodBank.findById(req.user._id);

    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found",
      });
    }

    // Update fields
    if (name) bloodBank.name = name;
    if (phone) bloodBank.phone = phone;
    if (address) bloodBank.address = address;
    if (city) bloodBank.city = city;

    await bloodBank.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      bloodBank,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
};

// @desc    Verify donation and create donation record
// @route   POST /api/bloodbanks/verify-donation
// @access  Private (Blood Bank only)
exports.verifyDonation = async (req, res) => {
  try {
    const { userId, quantity = 450 } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Get blood bank details
    const bloodBank = await BloodBank.findById(req.user.id);
    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found",
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

    // Check if user can donate (3 months gap)
    if (user.lastDonationDate) {
      const daysSinceLastDonation = Math.floor(
        (new Date() - new Date(user.lastDonationDate)) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastDonation < 90) {
        return res.status(400).json({
          success: false,
          message: `Donor must wait ${90 - daysSinceLastDonation} more days before donating again`,
          daysRemaining: 90 - daysSinceLastDonation,
        });
      }
    }

    // Create donation history record
    const DonationHistory = require("../models/DonationHistory");
    const donation = await DonationHistory.create({
      userId: user._id,
      bloodBankId: bloodBank._id,
      location: bloodBank.name,
      date: new Date(),
      quantity: quantity,
      bloodType: user.bloodType,
      status: "completed",
      notes: `Donated at ${bloodBank.name}`,
    });

    // Update user stats
    user.lastDonationDate = new Date();
    user.totalDonations = (user.totalDonations || 0) + 1;
    await user.save();

    // Update blood bank inventory
    const bloodTypeKey = user.bloodType.replace('+', 'Positive').replace('-', 'Negative');
    if (bloodBank.inventory && bloodBank.inventory[bloodTypeKey] !== undefined) {
      bloodBank.inventory[bloodTypeKey] += 1;
      await bloodBank.save();
    }

    res.status(200).json({
      success: true,
      message: "Donation verified and recorded successfully",
      data: {
        donor: {
          name: user.name,
          bloodType: user.bloodType,
          email: user.email,
          phone: user.phone,
          totalDonations: user.totalDonations,
        },
        donation: donation,
        bloodBank: {
          name: bloodBank.name,
          city: bloodBank.city,
        },
      },
    });
  } catch (error) {
    console.error("Verify donation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while verifying donation",
    });
  }
};
