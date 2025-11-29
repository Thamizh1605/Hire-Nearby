const mongoose = require('mongoose');

const paymentRecordSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paidAt: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    enum: ['dummy'],
    default: 'dummy'
  },
  status: {
    type: String,
    enum: ['paid'],
    default: 'paid'
  }
});

module.exports = mongoose.model('PaymentRecord', paymentRecordSchema);

