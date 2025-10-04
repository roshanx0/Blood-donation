const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    bloodType: {
      type: String,
      required: [true, 'Blood type is required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1 unit'],
    },
    urgency: {
      type: String,
      required: [true, 'Urgency level is required'],
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    hospital: {
      type: String,
      trim: true,
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'requesterModel',
      required: true,
    },
    requesterModel: {
      type: String,
      required: true,
      enum: ['User', 'BloodBank'],
    },
    status: {
      type: String,
      enum: ['pending', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
    responses: [
      {
        responderId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'responses.responderModel',
        },
        responderModel: {
          type: String,
          enum: ['User', 'BloodBank'],
        },
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Request', requestSchema);