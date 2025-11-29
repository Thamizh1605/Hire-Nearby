const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get messages for a booking
router.get('/:bookingId/messages', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.requesterId.toString() !== req.user._id.toString() &&
        booking.providerId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ bookingId: booking._id })
      .populate('senderId', 'name role')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/:bookingId/messages', auth, [
  body('text').trim().notEmpty().withMessage('Message text is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.requesterId.toString() !== req.user._id.toString() &&
        booking.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = new Message({
      bookingId: booking._id,
      senderId: req.user._id,
      text: req.body.text,
      read: false
    });

    await message.save();
    await message.populate('senderId', 'name role');

    // Emit via Socket.IO if available
    const io = req.app.get('io');
    if (io) {
      io.to(`booking-${booking._id}`).emit('new-message', message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.patch('/:bookingId/messages/read', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.requesterId.toString() !== req.user._id.toString() &&
        booking.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Message.updateMany(
      {
        bookingId: booking._id,
        senderId: { $ne: req.user._id },
        read: false
      },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

