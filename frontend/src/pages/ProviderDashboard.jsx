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
    <div className="container mx-auto px-6 py-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Provider Dashboard</h1>
        <Link
          to="/browse"
          className="btn-primary"
        >
          Browse Jobs
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold text-gray-900">${earnings.total.toFixed(2)}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">This Month</h3>
          <p className="text-3xl font-bold text-sage-medium">${earnings.thisMonth.toFixed(2)}</p>
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
              <p className="text-gray-600 text-sm mb-4">No bookings yet.</p>
              <Link to="/browse" className="btn-primary inline-block">Browse available jobs</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div key={booking._id} className="card p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{booking.jobId?.title}</h3>
                      <p className="text-sm text-gray-600">Requester: {booking.requesterId?.name}</p>
                    </div>
                    <div className="text-right ml-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold uppercase block mb-1">
                        {booking.status}
                      </span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs font-semibold uppercase">
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    <span>📅 {format(new Date(booking.startTime), 'MMM dd, yyyy HH:mm')}</span>
                    <span className="ml-4">💰 ${booking.offerId?.hourlyRate}/hr</span>
                    <span className="ml-4">⏱️ {booking.jobId?.durationHours} hrs</span>
                  </div>
                  <div className="flex gap-2">
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
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-semibold text-sm transition-colors"
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

