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
    return <div className="container mx-auto px-6 py-10 text-sage-medium font-medium">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="section-title mb-0">Requester Dashboard</h1>
        <Link
          to="/post-job"
          className="btn-primary"
        >
          Post New Job
        </Link>
      </div>

      <div className="flex gap-4 mb-8 border-b-2 border-sage-light">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-6 py-3 font-semibold transition-colors duration-200 ${
            activeTab === 'jobs' 
              ? 'border-b-4 border-sage-medium text-sage-dark' 
              : 'text-sage-medium hover:text-sage-dark'
          }`}
        >
          My Jobs
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 font-semibold transition-colors duration-200 ${
            activeTab === 'bookings' 
              ? 'border-b-4 border-sage-medium text-sage-dark' 
              : 'text-sage-medium hover:text-sage-dark'
          }`}
        >
          Bookings
        </button>
      </div>

      {activeTab === 'jobs' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Posted Jobs</h2>
          {jobs.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-sage-medium text-lg mb-4">No jobs posted yet.</p>
              <Link to="/post-job" className="btn-primary inline-block">Post your first job</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <div key={job._id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-sage-dark mb-2">{job.title}</h3>
                      <p className="text-sage-medium">{job.description}</p>
                    </div>
                    <span className="px-4 py-1.5 bg-sage-light text-sage-dark rounded-full text-xs font-semibold uppercase tracking-wide">
                      {job.status}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-sage-medium mb-4">
                    <span>📅 {format(new Date(job.date), 'MMM dd, yyyy')}</span>
                    <span>⏰ {job.startTime}</span>
                    <span>📍 {job.location.city}</span>
                  </div>
                  {job.status === 'open' && (
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-sage-dark hover:text-sage-medium font-semibold transition-colors duration-200"
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
          <h2 className="section-title mb-6">My Bookings</h2>
          {bookings.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-sage-medium text-lg">No bookings yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-sage-dark mb-2">{booking.jobId?.title}</h3>
                      <p className="text-sage-medium">Provider: {booking.providerId?.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-4 py-1.5 bg-sage-light text-sage-dark rounded-full text-xs font-semibold uppercase tracking-wide block mb-2">
                        {booking.status}
                      </span>
                      <span className="px-4 py-1.5 bg-cream-light text-sage-dark rounded-full text-xs font-semibold uppercase tracking-wide">
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-sage-medium mb-4">
                    <span>📅 {format(new Date(booking.startTime), 'MMM dd, yyyy HH:mm')}</span>
                    <span className="ml-4">💰 ${booking.offerId?.hourlyRate}/hr</span>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/bookings/${booking._id}`}
                      className="btn-secondary text-sm"
                    >
                      View Details
                    </Link>
                    {booking.status === 'completed' && booking.paymentStatus === 'unpaid' && (
                      <button
                        onClick={() => handlePay(booking._id, booking.offerId?.hourlyRate * booking.jobId?.durationHours)}
                        className="btn-primary text-sm"
                      >
                        Pay Now
                      </button>
                    )}
                    {booking.status === 'completed' && booking.paymentStatus === 'unpaid' && (
                      <p className="text-sm text-sage-medium flex items-center">Waiting for payment</p>
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

