import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { format } from 'date-fns';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerData, setOfferData] = useState({
    hourlyRate: '',
    message: '',
    availabilityStart: '',
    availabilityEnd: ''
  });

  useEffect(() => {
    loadJob();
    if (user?.role === 'requester') {
      loadOffers();
    }
  }, [id, user]);

  const loadJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (error) {
      console.error('Failed to load job:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOffers = async () => {
    try {
      const res = await api.get(`/offers/jobs/${id}/offers`);
      setOffers(res.data);
    } catch (error) {
      console.error('Failed to load offers:', error);
    }
  };

  const handleMakeOffer = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/offers/jobs/${id}/offers`, offerData);
      alert('Offer submitted successfully!');
      setShowOfferForm(false);
      setOfferData({ hourlyRate: '', message: '', availabilityStart: '', availabilityEnd: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit offer');
    }
  };

  const handleAcceptOffer = async (offerId) => {
    if (!window.confirm('Accept this offer? This will create a booking.')) return;
    try {
      await api.post(`/offers/${offerId}/accept`);
      alert('Offer accepted! Booking created.');
      navigate('/dashboard/requester');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept offer');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!job) {
    return <div className="container mx-auto px-4 py-8">Job not found</div>;
  }

  const categoryColors = {
    cleaning: 'bg-blue-100 text-blue-800',
    cooking: 'bg-green-100 text-green-800',
    tutoring: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="container mx-auto px-6 py-8 bg-gray-50 min-h-screen">
      <Link to="/browse" className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block">
        ← Back to Browse
      </Link>

      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
          <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${categoryColors[job.category]}`}>
            {job.category}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{job.description}</p>

        <div className="grid md:grid-cols-2 gap-3 mb-6 text-sm">
          <div className="text-gray-600">
            <strong className="text-gray-900">Date:</strong> {format(new Date(job.date), 'MMM dd, yyyy')}
          </div>
          <div className="text-gray-600">
            <strong className="text-gray-900">Time:</strong> {job.startTime}
          </div>
          <div className="text-gray-600">
            <strong className="text-gray-900">Duration:</strong> {job.durationHours} hours
          </div>
          <div className="text-gray-600">
            <strong className="text-gray-900">Location:</strong> {job.location.city}
          </div>
          <div className="text-gray-600">
            <strong className="text-gray-900">Status:</strong> <span className="capitalize">{job.status}</span>
          </div>
          <div className="text-gray-600">
            <strong className="text-gray-900">Posted by:</strong> {job.requesterId?.name}
          </div>
        </div>

        {user?.role === 'provider' && job.status === 'open' && (
          <div className="mt-6">
            {!showOfferForm ? (
              <button
                onClick={() => setShowOfferForm(true)}
                className="btn-primary"
              >
                Make an Offer
              </button>
            ) : (
              <form onSubmit={handleMakeOffer} className="card mt-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Make an Offer</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hourly Rate ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={offerData.hourlyRate}
                      onChange={(e) => setOfferData({ ...offerData, hourlyRate: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                    <textarea
                      required
                      value={offerData.message}
                      onChange={(e) => setOfferData({ ...offerData, message: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Available From</label>
                    <input
                      type="datetime-local"
                      required
                      value={offerData.availabilityStart}
                      onChange={(e) => setOfferData({ ...offerData, availabilityStart: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Available Until</label>
                    <input
                      type="datetime-local"
                      required
                      value={offerData.availabilityEnd}
                      onChange={(e) => setOfferData({ ...offerData, availabilityEnd: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                  >
                    Submit Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOfferForm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {user?.role === 'requester' && job.requesterId?._id === user.id && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Offers Received</h3>
            {offers.length === 0 ? (
              <p className="text-gray-500">No offers yet.</p>
            ) : (
              <div className="space-y-4">
                {offers.map((offer) => (
                  <div key={offer._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <strong>{offer.providerId?.name}</strong>
                        <span className="ml-2 text-sm text-gray-600">
                          Rating: {offer.providerId?.rating?.avg?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-primary-600">
                        ${offer.hourlyRate}/hr
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{offer.message}</p>
                    <div className="text-sm text-gray-500 mb-2">
                      Available: {format(new Date(offer.availabilityStart), 'MMM dd, HH:mm')} -{' '}
                      {format(new Date(offer.availabilityEnd), 'MMM dd, HH:mm')}
                    </div>
                    <div className="text-sm mb-2">
                      Status: <span className="capitalize">{offer.status}</span>
                    </div>
                    {offer.status === 'pending' && (
                      <button
                        onClick={() => handleAcceptOffer(offer._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Accept Offer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

