const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['requester', 'provider', 'admin'],
    required: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    lat: {
      type: Number,
      required: false
    },
    lng: {
      type: Number,
      required: false
    }
  },
  rating: {
    avg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Round lat/lng to 3 decimals for privacy
userSchema.pre('save', function(next) {
  if (this.location && this.location.lat !== undefined) {
    this.location.lat = Math.round(this.location.lat * 1000) / 1000;
  }
  if (this.location && this.location.lng !== undefined) {
    this.location.lng = Math.round(this.location.lng * 1000) / 1000;
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  // If passwordHash is not already hashed (during registration)
  if (this.passwordHash && !this.passwordHash.startsWith('$2')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Method to update rating
userSchema.methods.updateRating = async function(newRating) {
  const totalRating = (this.rating.avg * this.rating.count) + newRating;
  this.rating.count += 1;
  this.rating.avg = totalRating / this.rating.count;
  await this.save();
};

module.exports = mongoose.model('User', userSchema);

