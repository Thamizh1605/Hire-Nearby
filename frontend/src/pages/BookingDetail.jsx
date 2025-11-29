import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Chat from '../components/Chat';
import { format } from 'date-fns';

export default function BookingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      const res = await api.get(`/bookings/${id}`);
      setBooking(res.data);
      
      // Check if review can be submitted
      if (res.data.status === 'completed' && res.data.paymentStatus === 'paid' && user?.role === 'requester') {
        // Check if review already exists
        try {
          const reviewRes = await api.get(`/bookings/provider/${res.data.providerId._id}/reviews`);
          const existingReview = reviewRes.data.find(r => r.bookingId === res.data._id);
          if (!existingReview) {
            setShowReviewForm(true);
          }
        } catch (error) {
          // No review yet
        }
      }
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/bookings/${id}/review`, review);
      alert('Review submitted!');
      setShowReviewForm(false);
      loadBooking();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handlePay = async () => {
    const amount = booking.offerId?.hourlyRate * booking.jobId?.durationHours;
    const payAmount = prompt('Enter payment amount:', amount);
    if (!payAmount) return;
    
    try {
      await api.post(`/bookings/${id}/pay`, { amount: parseFloat(payAmount) });
      alert('Payment completed!');
      loadBooking();
    } catch (error) {
      alert(error.response?.data?.message || 'Payment failed');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!booking) {
    return <div className="container mx-auto px-4 py-8">Booking not found</div>;
  }

  const isRequester = user?.role === 'requester' && booking.requesterId._id === user.id;
  const isProvider = user?.role === 'provider' && booking.providerId._id === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to={isRequester ? '/dashboard/requester' : '/dashboard/provider'} className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h1 className="text-3xl font-bold mb-6">{booking.jobId?.title}</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Job Details</h3>
            <p className="text-gray-600 mb-2">{booking.jobId?.description}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <div>📅 Date: {format(new Date(booking.startTime), 'MMM dd, yyyy')}</div>
              <div>⏰ Time: {format(new Date(booking.startTime), 'HH:mm')}</div>
              <div>⏱️ Duration: {booking.jobId?.durationHours} hours</div>
              <div>📍 Location: {booking.jobId?.location.city}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              {isRequester ? 'Provider' : 'Requester'} Information
            </h3>
            <div className="text-sm space-y-1">
              <div><strong>Name:</strong> {isRequester ? booking.providerId?.name : booking.requesterId?.name}</div>
              <div><strong>City:</strong> {isRequester ? booking.providerId?.city : booking.requesterId?.city}</div>
              {isRequester && booking.providerId?.rating && (
                <div>
                  <strong>Rating:</strong> {booking.providerId.rating.avg.toFixed(1)} ({booking.providerId.rating.count} reviews)
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Offer Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-primary-600 mb-2">
              ${booking.offerId?.hourlyRate}/hour
            </div>
            <p className="text-gray-700">{booking.offerId?.message}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm capitalize">
              Status: {booking.status}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm capitalize">
              Payment: {booking.paymentStatus}
            </span>
          </div>
        </div>

        {isRequester && booking.status === 'completed' && booking.paymentStatus === 'unpaid' && (
          <div className="mb-6">
            <button
              onClick={handlePay}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Pay Now
            </button>
          </div>
        )}

        {showReviewForm && (
          <div className="mb-6 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select
                  value={review.rating}
                  onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Chat</h2>
        <Chat bookingId={id} />
      </div>
    </div>
  );
}

