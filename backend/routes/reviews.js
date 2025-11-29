const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create review (Requester only, after payment)
router.post('/:bookingId/review', auth, requireRole('requester'), [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.bookingId)
      .populate('jobId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.requesterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Payment must be completed before reviewing' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Booking must be completed' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId: booking._id });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    const review = new Review({
      jobId: booking.jobId._id,
      bookingId: booking._id,
      providerId: booking.providerId,
      requesterId: req.user._id,
      rating: parseInt(req.body.rating),
      comment: req.body.comment || ''
    });

    await review.save();

    // Update provider rating
    const provider = await User.findById(booking.providerId);
    await provider.updateRating(review.rating);

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a provider
router.get('/provider/:providerId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate('requesterId', 'name city')
      .populate('jobId', 'title category')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

