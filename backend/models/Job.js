const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['cleaning', 'cooking', 'tutoring'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // e.g., "14:30"
    required: true
  },
  durationHours: {
    type: Number,
    required: true,
    min: 0.5
  },
  priceType: {
    type: String,
    enum: ['hourly'],
    default: 'hourly'
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  location: {
    city: {
      type: String,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['open', 'booked', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  acceptedOfferId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    default: null
  }
});

// Round lat/lng to 3 decimals for privacy
jobSchema.pre('save', function(next) {
  if (this.location.lat !== undefined) {
    this.location.lat = Math.round(this.location.lat * 1000) / 1000;
  }
  if (this.location.lng !== undefined) {
    this.location.lng = Math.round(this.location.lng * 1000) / 1000;
  }
  next();
});

module.exports = mongoose.model('Job', jobSchema);

