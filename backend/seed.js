const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Job = require('./models/Job');
const Offer = require('./models/Offer');
const Booking = require('./models/Booking');

// Helper to round coordinates
function roundCoord(coord) {
  return Math.round(coord * 1000) / 1000;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hire-nearby');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Offer.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@test.com',
      passwordHash: 'admin123', // Will be hashed
      role: 'admin',
      city: 'San Francisco',
      location: { lat: roundCoord(37.7749), lng: roundCoord(-122.4194) }
    });
    await admin.save();
    console.log('Created admin user');

    // Create requester
    const requester = new User({
      name: 'John Requester',
      email: 'requester@test.com',
      passwordHash: 'password123',
      role: 'requester',
      city: 'San Francisco',
      location: { lat: roundCoord(37.7849), lng: roundCoord(-122.4094) }
    });
    await requester.save();
    console.log('Created requester user');

    // Create providers
    const provider1 = new User({
      name: 'Alice Provider',
      email: 'provider1@test.com',
      passwordHash: 'password123',
      role: 'provider',
      city: 'San Francisco',
      location: { lat: roundCoord(37.7649), lng: roundCoord(-122.4294) },
      rating: { avg: 4.5, count: 10 }
    });
    await provider1.save();

    const provider2 = new User({
      name: 'Bob Provider',
      email: 'provider2@test.com',
      passwordHash: 'password123',
      role: 'provider',
      city: 'Oakland',
      location: { lat: roundCoord(37.8044), lng: roundCoord(-122.2711) },
      rating: { avg: 4.8, count: 15 }
    });
    await provider2.save();
    console.log('Created provider users');

    // Create sample jobs
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const job1 = new Job({
      requesterId: requester._id,
      title: 'Deep Clean Apartment',
      description: 'Need a thorough deep clean of my 2-bedroom apartment. Focus on kitchen and bathrooms.',
      category: 'cleaning',
      date: tomorrow,
      startTime: '10:00',
      durationHours: 4,
      priceType: 'hourly',
      location: {
        city: 'San Francisco',
        lat: roundCoord(37.7749),
        lng: roundCoord(-122.4194)
      },
      status: 'open'
    });
    await job1.save();

    const job2 = new Job({
      requesterId: requester._id,
      title: 'Cook Dinner for Party',
      description: 'Need someone to cook a dinner for 8 people. Italian cuisine preferred.',
      category: 'cooking',
      date: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000),
      startTime: '17:00',
      durationHours: 3,
      priceType: 'hourly',
      location: {
        city: 'San Francisco',
        lat: roundCoord(37.7849),
        lng: roundCoord(-122.4094)
      },
      status: 'open'
    });
    await job2.save();

    const job3 = new Job({
      requesterId: requester._id,
      title: 'Math Tutoring Session',
      description: 'Need help with algebra homework. 2-hour session.',
      category: 'tutoring',
      date: new Date(tomorrow.getTime() + 3 * 24 * 60 * 60 * 1000),
      startTime: '14:00',
      durationHours: 2,
      priceType: 'hourly',
      location: {
        city: 'San Francisco',
        lat: roundCoord(37.7649),
        lng: roundCoord(-122.4294)
      },
      status: 'open'
    });
    await job3.save();
    console.log('Created sample jobs');

    // Create sample offers
    const offer1 = new Offer({
      jobId: job1._id,
      providerId: provider1._id,
      hourlyRate: 25,
      message: 'I have 5 years of experience in professional cleaning. Available at your requested time.',
      availabilityStart: new Date(tomorrow.setHours(9, 0, 0, 0)),
      availabilityEnd: new Date(tomorrow.setHours(18, 0, 0, 0)),
      status: 'pending'
    });
    await offer1.save();

    const offer2 = new Offer({
      jobId: job2._id,
      providerId: provider2._id,
      hourlyRate: 40,
      message: 'Professional chef with Italian cuisine specialization. Can prepare a delicious meal for your party.',
      availabilityStart: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000),
      availabilityEnd: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
      status: 'pending'
    });
    await offer2.save();
    console.log('Created sample offers');

    console.log('\n✅ Seed completed successfully!');
    console.log('\nTest accounts:');
    console.log('Admin: admin@test.com / admin123');
    console.log('Requester: requester@test.com / password123');
    console.log('Provider 1: provider1@test.com / password123');
    console.log('Provider 2: provider2@test.com / password123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();

