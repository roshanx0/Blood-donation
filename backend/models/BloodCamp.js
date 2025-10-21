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

// Auto-update status based on date and time
bloodCampSchema.methods.updateStatus = function () {
  const campDate = new Date(this.date);
  const today = new Date();

  // Set both to start of day for proper comparison
  campDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // Don't change if manually set to cancelled
  if (this.status === "cancelled") {
    return this.status;
  }

  const campTime = campDate.getTime();
  const todayTime = today.getTime();

  // If camp date has passed (not today), mark as completed
  if (campTime < todayTime) {
    this.status = "completed";
  }
  // If camp is today, mark as ongoing
  else if (campTime === todayTime) {
    this.status = "ongoing";
  }
  // If camp is in the future, mark as upcoming
  else {
    this.status = "upcoming";
  }

  return this.status;
};

// Pre-find middleware to auto-update status
bloodCampSchema.pre(/^find/, function (next) {
  // Update status for all camps being queried
  this.setOptions({ runValidators: false });
  next();
});

const BloodCamp = mongoose.model("BloodCamp", bloodCampSchema);

module.exports = BloodCamp;
