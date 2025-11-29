import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { format } from 'date-fns';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState({ total: 0, thisMonth: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
      
      // Calculate earnings
      const paidBookings = res.data.filter(b => b.paymentStatus === 'paid');
      const total = paidBookings.reduce((sum, b) => {
        const hours = b.jobId?.durationHours || 0;
        const rate = b.offerId?.hourlyRate || 0;
        return sum + (hours * rate);
      }, 0);
      
      const thisMonth = paidBookings
        .filter(b => {
          const paidDate = new Date(b.paidAt || b.createdAt);
          const now = new Date();
          return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, b) => {
          const hours = b.jobId?.durationHours || 0;
          const rate = b.offerId?.hourlyRate || 0;
          return sum + (hours * rate);
        }, 0);
      
      setEarnings({ total, thisMonth });
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartJob = async (bookingId) => {
    try {
      await api.post(`/bookings/${bookingId}/start`);
      alert('Job started!');
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to start job');
    }
  };

  const handleCompleteJob = async (bookingId) => {
    try {
      await api.post(`/bookings/${bookingId}/complete`);
      alert('Job marked as completed!');
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to complete job');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-6 py-10 text-sage-medium font-medium">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="section-title mb-0">Provider Dashboard</h1>
        <Link
          to="/browse"
          className="btn-primary"
        >
          Browse Jobs
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card p-8">
          <h3 className="text-lg font-semibold text-sage-medium mb-3">Total Earnings</h3>
          <p className="text-4xl font-bold text-sage-dark">${earnings.total.toFixed(2)}</p>
        </div>
        <div className="card p-8">
          <h3 className="text-lg font-semibold text-sage-medium mb-3">This Month</h3>
          <p className="text-4xl font-bold text-sage-medium">${earnings.thisMonth.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 ${activeTab === 'bookings' ? 'border-b-2 border-primary-600 text-primary-600' : ''}`}
        >
          My Bookings
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
          {bookings.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-sage-medium text-lg mb-4">No bookings yet.</p>
              <Link to="/browse" className="btn-primary inline-block">Browse available jobs</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-sage-dark mb-2">{booking.jobId?.title}</h3>
                      <p className="text-sage-medium">Requester: {booking.requesterId?.name}</p>
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
                    <span className="ml-4">⏱️ {booking.jobId?.durationHours} hrs</span>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/bookings/${booking._id}`}
                      className="btn-secondary text-sm"
                    >
                      View Details
                    </Link>
                    {booking.status === 'accepted' && (
                      <button
                        onClick={() => handleStartJob(booking._id)}
                        className="btn-primary text-sm"
                      >
                        Start Job
                      </button>
                    )}
                    {booking.status === 'in_progress' && (
                      <button
                        onClick={() => handleCompleteJob(booking._id)}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-xl font-semibold shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 active:scale-95 text-sm"
                      >
                        Mark Complete
                      </button>
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

