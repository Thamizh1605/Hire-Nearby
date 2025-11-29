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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-400">Browse Jobs</h1>

      <div className="bg-dark-400 border border-primary-800 rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-300 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 bg-dark-500 border border-primary-700 rounded-md text-primary-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Categories</option>
              <option value="cleaning">Cleaning</option>
              <option value="cooking">Cooking</option>
              <option value="tutoring">Tutoring</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Enter city"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {userLocation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Radius (km)
              </label>
              <input
                type="number"
                value={filters.radiusKm}
                onChange={(e) => handleFilterChange('radiusKm', e.target.value)}
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
              <option value="availability">Date</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price ($/hr)
            </label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="No limit"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-primary-300">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 text-primary-500">
          No jobs found. Try adjusting your filters.
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

