const mongoose = require("mongoose");

const bloodCampSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Camp title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organizer is required"],
    },
    organizerDetails: {
      type: {
        name: String,
        type: String,
        phone: String,
        email: String,
      },
      _id: false,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    date: {
      type: Date,
      required: [true, "Camp date is required"],
      validate: {
        validator: function (v) {
          return v > new Date();
        },
        message: "Camp date must be in the future",
      },
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    expectedDonors: {
      type: Number,
      required: [true, "Expected number of donors is required"],
      min: [10, "Expected donors must be at least 10"],
    },
    registeredDonors: [
      {
        donor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
        attended: {
          type: Boolean,
          default: false,
        },
      },
    ],
    facilities: [
      {
        type: String,
        trim: true,
      },
    ],
    requirements: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    bloodBankPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBank",
    },
    contactPerson: {
      name: {
        type: String,
        required: [true, "Contact person name is required"],
      },
      phone: {
        type: String,
        required: [true, "Contact person phone is required"],
      },
      email: String,
    },
    images: [String],
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching camps
bloodCampSchema.index({ city: 1, date: 1, status: 1 });

// Virtual for total registered donors
bloodCampSchema.virtual("totalRegistered").get(function () {
  return this.registeredDonors.length;
});

// Check if camp is full
bloodCampSchema.methods.isFull = function () {
  return this.registeredDonors.length >= this.expectedDonors;
};

// Check if user is already registered
bloodCampSchema.methods.isUserRegistered = function (userId) {
  return this.registeredDonors.some(
    (donor) => donor.donor.toString() === userId.toString()
  );
};

const BloodCamp = mongoose.model("BloodCamp", bloodCampSchema);

module.exports = BloodCamp;
