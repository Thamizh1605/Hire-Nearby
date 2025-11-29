const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      city: req.user.city,
      location: req.user.location,
      rating: req.user.rating,
      createdAt: req.user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update current user profile
router.patch('/me', auth, [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('city').optional().trim().notEmpty().withMessage('City cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, city, lat, lng } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (city) updates.city = city;

    if (lat !== undefined && lng !== undefined) {
      updates.location = {
        lat: Math.round(parseFloat(lat) * 1000) / 1000,
        lng: Math.round(parseFloat(lng) * 1000) / 1000
      };
    }

    Object.assign(req.user, updates);
    await req.user.save();

    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      city: req.user.city,
      location: req.user.location,
      rating: req.user.rating
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get provider profile by ID
router.get('/providers/:id/profile', async (req, res) => {
  try {
    const provider = await User.findById(req.params.id)
      .select('-passwordHash')
      .where('role').equals('provider');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json({
      id: provider._id,
      name: provider.name,
      city: provider.city,
      location: provider.location,
      rating: provider.rating,
      createdAt: provider.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

