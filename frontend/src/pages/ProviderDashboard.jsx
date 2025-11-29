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
    return <div className="container mx-auto px-4 py-8 text-primary-300">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-400">Provider Dashboard</h1>
        <Link
          to="/browse"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-500 transition"
        >
          Browse Jobs
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-dark-400 border border-primary-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-primary-400 mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold text-primary-500">${earnings.total.toFixed(2)}</p>
        </div>
        <div className="bg-dark-400 border border-primary-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-primary-400 mb-2">This Month</h3>
          <p className="text-3xl font-bold text-green-400">${earnings.thisMonth.toFixed(2)}</p>
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
            <div className="bg-dark-400 border border-primary-800 rounded-lg shadow-md p-8 text-center text-primary-500">
              No bookings yet. <Link to="/browse" className="text-primary-400 hover:text-primary-300">Browse available jobs</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-dark-400 border border-primary-800 rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-primary-300">{booking.jobId?.title}</h3>
                      <p className="text-primary-400">Requester: {booking.requesterId?.name}</p>
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
                    <span className="ml-4">⏱️ {booking.jobId?.durationHours} hrs</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/bookings/${booking._id}`}
                      className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                    >
                      View Details
                    </Link>
                    {booking.status === 'accepted' && (
                      <button
                        onClick={() => handleStartJob(booking._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Start Job
                      </button>
                    )}
                    {booking.status === 'in_progress' && (
                      <button
                        onClick={() => handleCompleteJob(booking._id)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
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

