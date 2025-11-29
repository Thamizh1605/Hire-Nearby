import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import JobCard from '../components/JobCard';

export default function BrowseJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    radiusKm: '10',
    sort: 'distance',
    maxPrice: '',
    date: ''
  });
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Fallback to user's city if available
          if (user?.city) {
            setFilters({ ...filters, city: user.city });
          }
        }
      );
    } else if (user?.city) {
      setFilters({ ...filters, city: user.city });
    }
  }, [user]);

  useEffect(() => {
    loadJobs();
  }, [filters, userLocation]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);
      if (userLocation) {
        params.append('lat', userLocation.lat);
        params.append('lng', userLocation.lng);
        params.append('radiusKm', filters.radiusKm);
      }
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.date) params.append('date', filters.date);

      const res = await api.get(`/jobs?${params.toString()}`);
      setJobs(res.data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="section-title">Browse Jobs</h1>

      <div className="card p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-sage-dark mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              <option value="cleaning">Cleaning</option>
              <option value="cooking">Cooking</option>
              <option value="tutoring">Tutoring</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-sage-dark mb-2">
              City
            </label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Enter city"
              className="input-field"
            />
          </div>

          {userLocation && (
            <div>
              <label className="block text-sm font-semibold text-sage-dark mb-2">
                Radius (km)
              </label>
              <input
                type="number"
                value={filters.radiusKm}
                onChange={(e) => handleFilterChange('radiusKm', e.target.value)}
                min="1"
                max="100"
                className="input-field"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-sage-dark mb-2">
              Sort By
            </label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="input-field"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
              <option value="availability">Date</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-sage-dark mb-2">
              Max Price ($/hr)
            </label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="No limit"
              min="0"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-sage-dark mb-2">
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sage-medium font-medium">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sage-medium text-lg">No jobs found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

