const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    type: {
      type: String,
      required: [true, "Organization type is required"],
      enum: ["hospital", "ngo", "college"],
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
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
      unique: true,
      trim: true,
    },
    contactPerson: {
      name: {
        type: String,
        required: [true, "Contact person name is required"],
        trim: true,
      },
      designation: {
        type: String,
        required: [true, "Contact person designation is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Contact person phone is required"],
        trim: true,
      },
    },
    established: {
      type: Date,
      required: [true, "Establishment date is required"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "organization",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
organizationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
organizationSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Don't send password in response
organizationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
