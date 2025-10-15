const mongoose = require("mongoose");

const donationHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    quantity: {
      type: Number,
      default: 450, // ml
      min: 0,
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    status: {
      type: String,
      enum: ["completed", "scheduled", "cancelled"],
      default: "completed",
    },
    notes: {
      type: String,
      trim: true,
    },
    campId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodCamp",
    },
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBank",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
donationHistorySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("DonationHistory", donationHistorySchema);
