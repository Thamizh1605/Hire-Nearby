const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Job = require('../models/Job');
const PaymentRecord = require('../models/PaymentRecord');
const { auth } = require('../middleware/auth');
const { sendBookingStartedNotification, sendBookingCompletedNotification, sendPaymentReceivedNotification } = require('../utils/email');

const router = express.Router();

// Get bookings (filtered by user role)
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'requester') {
      query.requesterId = req.user._id;
    } else if (req.user.role === 'provider') {
      query.providerId = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('jobId', 'title description category date startTime durationHours location')
      .populate('requesterId', 'name city')
      .populate('providerId', 'name city rating')
      .populate('offerId', 'hourlyRate message')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('jobId', 'title description category date startTime durationHours location')
      .populate('requesterId', 'name email city')
      .populate('providerId', 'name email city rating')
      .populate('offerId', 'hourlyRate message');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.requesterId._id.toString() !== req.user._id.toString() &&
        booking.providerId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start booking (Provider only)
router.post('/:id/start', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('providerId jobId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.providerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'accepted') {
      return res.status(400).json({ message: 'Booking must be accepted first' });
    }

    booking.status = 'in_progress';
    await booking.save();

    const job = await Job.findById(booking.jobId._id);
    job.status = 'in_progress';
    await job.save();

    await booking.populate('requesterId', 'email name');
    await sendBookingStartedNotification(
      booking.requesterId.email,
      booking.providerId.name
    );

    res.json(booking);
  } catch (error) {
    console.error('Start booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete booking (Provider only)
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('providerId jobId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.providerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'in_progress') {
      return res.status(400).json({ message: 'Booking must be in progress' });
    }

    booking.status = 'completed';
    await booking.save();

    const job = await Job.findById(booking.jobId._id);
    job.status = 'completed';
    await job.save();

    await booking.populate('requesterId', 'email name');
    await sendBookingCompletedNotification(
      booking.requesterId.email,
      booking.providerId.name
    );

    res.json(booking);
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Pay booking (Requester only) - Dummy payment
router.post('/:id/pay', auth, [
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('offerId providerId jobId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.requesterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Booking must be completed first' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    const amount = parseFloat(req.body.amount);

    // Create payment record (dummy)
    const paymentRecord = new PaymentRecord({
      bookingId: booking._id,
      amount,
      method: 'dummy',
      status: 'paid'
    });

    await paymentRecord.save();

    booking.paymentStatus = 'paid';
    await booking.save();

    await sendPaymentReceivedNotification(
      booking.providerId.email,
      amount
    );

    res.json({ booking, paymentRecord });
  } catch (error) {
    console.error('Pay booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

