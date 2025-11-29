const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  availabilityStart: {
    type: Date,
    required: true
  },
  availabilityEnd: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
});

// Ensure availabilityEnd is after availabilityStart
offerSchema.pre('save', function(next) {
  if (this.availabilityEnd <= this.availabilityStart) {
    return next(new Error('Availability end must be after start'));
  }
  next();
});

module.exports = mongoose.model('Offer', offerSchema);

