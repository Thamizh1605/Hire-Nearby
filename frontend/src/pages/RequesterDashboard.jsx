import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { format } from 'date-fns';

export default function RequesterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, bookingsRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/bookings')
      ]);
      
      // Filter jobs posted by this requester
      const allJobs = jobsRes.data;
      const myJobs = allJobs.filter(job => job.requesterId?._id === user.id || job.requesterId === user.id);
      setJobs(myJobs);
      
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Note: Requester cannot mark complete - only provider can

  const handlePay = async (bookingId, amount) => {
    const payAmount = prompt('Enter payment amount:', amount);
    if (!payAmount) return;
    
    try {
      await api.post(`/bookings/${bookingId}/pay`, { amount: parseFloat(payAmount) });
      alert('Payment completed!');
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Payment failed');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-primary-300">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-400">Requester Dashboard</h1>
        <Link
          to="/post-job"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-500 transition"
        >
          Post New Job
        </Link>
      </div>

      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 ${activeTab === 'jobs' ? 'border-b-2 border-primary-600 text-primary-600' : ''}`}
        >
          My Jobs
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 ${activeTab === 'bookings' ? 'border-b-2 border-primary-600 text-primary-600' : ''}`}
        >
          Bookings
        </button>
      </div>

      {activeTab === 'jobs' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Posted Jobs</h2>
          {jobs.length === 0 ? (
            <div className="bg-dark-400 border border-primary-800 rounded-lg shadow-md p-8 text-center text-primary-500">
              No jobs posted yet. <Link to="/post-job" className="text-primary-400 hover:text-primary-300">Post your first job</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="bg-dark-400 border border-primary-800 rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-primary-300">{job.title}</h3>
                      <p className="text-primary-400">{job.description}</p>
                    </div>
                    <span className="px-3 py-1 bg-primary-900 text-primary-300 border border-primary-700 rounded-full text-sm capitalize">
                      {job.status}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-primary-500 mb-3">
                    <span>📅 {format(new Date(job.date), 'MMM dd, yyyy')}</span>
                    <span>⏰ {job.startTime}</span>
                    <span>📍 {job.location.city}</span>
                  </div>
                  {job.status === 'open' && (
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      View Offers →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
          {bookings.length === 0 ? (
            <div className="bg-dark-400 border border-primary-800 rounded-lg shadow-md p-8 text-center text-primary-500">
              No bookings yet.
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-dark-400 border border-primary-800 rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-primary-300">{booking.jobId?.title}</h3>
                      <p className="text-primary-400">Provider: {booking.providerId?.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-primary-900 text-primary-300 border border-primary-700 rounded-full text-sm capitalize block mb-2">
                        {booking.status}
                      </span>
                      <span className="px-3 py-1 bg-dark-500 text-primary-300 border border-primary-700 rounded-full text-sm capitalize">
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-primary-500 mb-3">
                    <span>📅 {format(new Date(booking.startTime), 'MMM dd, yyyy HH:mm')}</span>
                    <span className="ml-4">💰 ${booking.offerId?.hourlyRate}/hr</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/bookings/${booking._id}`}
                      className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                    >
                      View Details
                    </Link>
                    {booking.status === 'completed' && booking.paymentStatus === 'unpaid' && (
                      <button
                        onClick={() => handlePay(booking._id, booking.offerId?.hourlyRate * booking.jobId?.durationHours)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Pay Now
                      </button>
                    )}
                    {booking.status === 'completed' && booking.paymentStatus === 'unpaid' && (
                      <p className="text-sm text-primary-500">Waiting for payment</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

