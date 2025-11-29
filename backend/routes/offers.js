const express = require('express');
const { body, validationResult } = require('express-validator');
const Offer = require('../models/Offer');
const Job = require('../models/Job');
const Booking = require('../models/Booking');
const { auth, requireRole } = require('../middleware/auth');
const { sendNewOfferNotification, sendOfferAcceptedNotification } = require('../utils/email');

const router = express.Router();

// Create offer (Provider only)
router.post('/jobs/:jobId/offers', auth, requireRole('provider'), [
  body('hourlyRate').isFloat({ min: 0 }).withMessage('Valid hourly rate required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('availabilityStart').isISO8601().withMessage('Valid availability start required'),
  body('availabilityEnd').isISO8601().withMessage('Valid availability end required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: 'Job is not open for offers' });
    }

    // Check for overlapping bookings
    const { availabilityStart, availabilityEnd } = req.body;
    const existingBookings = await Booking.find({
      providerId: req.user._id,
      status: { $in: ['accepted', 'in_progress'] },
      $or: [
        { startTime: { $lt: new Date(availabilityEnd) }, endTime: { $gt: new Date(availabilityStart) } }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'You have a conflicting booking at this time' });
    }

    // Check if provider already made an offer
    const existingOffer = await Offer.findOne({
      jobId: job._id,
      providerId: req.user._id,
      status: 'pending'
    });

    if (existingOffer) {
      return res.status(400).json({ message: 'You already have a pending offer for this job' });
    }

    const offer = new Offer({
      jobId: job._id,
      providerId: req.user._id,
      hourlyRate: parseFloat(req.body.hourlyRate),
      message: req.body.message,
      availabilityStart: new Date(req.body.availabilityStart),
      availabilityEnd: new Date(req.body.availabilityEnd),
      status: 'pending'
    });

    await offer.save();
    await offer.populate('providerId', 'name email');

    // Send notification
    await job.populate('requesterId', 'email name');
    await sendNewOfferNotification(
      job.requesterId.email,
      offer.providerId.name,
      job.title
    );

    res.status(201).json(offer);
  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get offers for a job (Requester only)
router.get('/jobs/:jobId/offers', auth, requireRole('requester'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.requesterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const offers = await Offer.find({ jobId: job._id })
      .populate('providerId', 'name city rating')
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept offer (Requester only)
router.post('/:id/accept', auth, requireRole('requester'), async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('jobId');
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    const job = offer.jobId;
    if (job.requesterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: 'Job is not open' });
    }

    if (offer.status !== 'pending') {
      return res.status(400).json({ message: 'Offer is not pending' });
    }

    // Reject other pending offers
    await Offer.updateMany(
      { jobId: job._id, _id: { $ne: offer._id }, status: 'pending' },
      { status: 'rejected' }
    );

    // Accept this offer
    offer.status = 'accepted';
    await offer.save();

    // Update job
    job.status = 'booked';
    job.acceptedOfferId = offer._id;
    await job.save();

    // Create booking
    const jobDate = new Date(job.date);
    const [hours, minutes] = job.startTime.split(':');
    jobDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const endTime = new Date(jobDate);
    endTime.setHours(endTime.getHours() + job.durationHours);

    const booking = new Booking({
      jobId: job._id,
      offerId: offer._id,
      requesterId: req.user._id,
      providerId: offer.providerId,
      startTime: jobDate,
      endTime: endTime,
      status: 'accepted',
      paymentStatus: 'unpaid'
    });

    await booking.save();
    await booking.populate('providerId', 'email name');

    // Send notification
    await sendOfferAcceptedNotification(
      booking.providerId.email,
      req.user.name,
      job.title
    );

    res.json({ booking, offer, job });
  } catch (error) {
    console.error('Accept offer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

