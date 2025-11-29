const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const Offer = require('../models/Offer');
const { auth, requireRole } = require('../middleware/auth');
const { haversineDistance } = require('../utils/distance');

const router = express.Router();

// Create job (Requester only)
router.post('/', auth, requireRole('requester'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['cleaning', 'cooking', 'tutoring']).withMessage('Invalid category'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:mm) required'),
  body('durationHours').isFloat({ min: 0.5 }).withMessage('Duration must be at least 0.5 hours'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('lat').isFloat().withMessage('Valid latitude required'),
  body('lng').isFloat().withMessage('Valid longitude required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, date, startTime, durationHours, city, lat, lng } = req.body;

    const job = new Job({
      requesterId: req.user._id,
      title,
      description,
      category,
      date: new Date(date),
      startTime,
      durationHours,
      priceType: 'hourly',
      location: {
        city,
        lat: Math.round(parseFloat(lat) * 1000) / 1000,
        lng: Math.round(parseFloat(lng) * 1000) / 1000
      },
      status: 'open'
    });

    await job.save();
    await job.populate('requesterId', 'name email city');

    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get jobs with filters and sorting
router.get('/', async (req, res) => {
  try {
    const {
      category,
      city,
      lat,
      lng,
      radiusKm,
      sort = 'distance',
      maxPrice,
      date
    } = req.query;

    let query = { status: 'open' };

    if (category) {
      query.category = category;
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    if (date) {
      const dateObj = new Date(date);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: dateObj, $lt: nextDay };
    }

    let jobs = await Job.find(query)
      .populate('requesterId', 'name city rating')
      .sort({ postedAt: -1 });

    // Calculate distance and filter by radius if lat/lng provided
    if (lat && lng && radiusKm) {
      const searchLat = parseFloat(lat);
      const searchLng = parseFloat(lng);
      const radius = parseFloat(radiusKm);

      jobs = jobs.map(job => {
        const distance = haversineDistance(
          searchLat,
          searchLng,
          job.location.lat,
          job.location.lng
        );
        return { ...job.toObject(), distance };
      }).filter(job => job.distance <= radius);
    } else {
      jobs = jobs.map(job => ({ ...job.toObject(), distance: null }));
    }

    // Filter by max price (if offers exist)
    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice);
      const jobsWithOffers = await Promise.all(
        jobs.map(async (job) => {
          const offers = await Offer.find({ jobId: job._id, status: 'pending' });
          const minRate = offers.length > 0 ? Math.min(...offers.map(o => o.hourlyRate)) : null;
          return { ...job, minRate };
        })
      );
      jobs = jobsWithOffers.filter(job => !job.minRate || job.minRate <= maxPriceNum);
    }

    // Sort
    if (sort === 'distance' && lat && lng) {
      jobs.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    } else if (sort === 'rating') {
      jobs.sort((a, b) => (b.requesterId?.rating?.avg || 0) - (a.requesterId?.rating?.avg || 0));
    } else if (sort === 'price') {
      // Sort by minimum offer rate
      jobs.sort((a, b) => (a.minRate || Infinity) - (b.minRate || Infinity));
    } else if (sort === 'availability') {
      jobs.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('requesterId', 'name city rating');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

