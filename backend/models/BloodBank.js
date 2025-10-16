const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const bloodBankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Blood bank name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Phone number must be 10 digits",
      },
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
    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: "bloodbank",
    },
    inventory: [
      {
        bloodType: {
          type: String,
          enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        quantity: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Initialize inventory with all blood types
bloodBankSchema.pre("save", function (next) {
  if (this.isNew && this.inventory.length === 0) {
    this.inventory = [
      { bloodType: "A+", quantity: 0 },
      { bloodType: "A-", quantity: 0 },
      { bloodType: "B+", quantity: 0 },
      { bloodType: "B-", quantity: 0 },
      { bloodType: "AB+", quantity: 0 },
      { bloodType: "AB-", quantity: 0 },
      { bloodType: "O+", quantity: 0 },
      { bloodType: "O-", quantity: 0 },
    ];
  }
  next();
});

// Hash password before saving
bloodBankSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
bloodBankSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
bloodBankSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("BloodBank", bloodBankSchema);
