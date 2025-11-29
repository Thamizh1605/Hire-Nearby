import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function JobCard({ job }) {
  const categoryColors = {
    cleaning: 'bg-blue-900 text-blue-300 border border-blue-700',
    cooking: 'bg-green-900 text-green-300 border border-green-700',
    tutoring: 'bg-purple-900 text-purple-300 border border-purple-700'
  };

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block bg-dark-400 border border-primary-800 rounded-lg shadow-md hover:shadow-lg hover:border-primary-600 transition-all p-6"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-primary-300">{job.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[job.category]}`}>
          {job.category}
        </span>
      </div>
      <p className="text-primary-400 mb-4 line-clamp-2">{job.description}</p>
      <div className="flex flex-wrap gap-4 text-sm text-primary-500">
        <span>📍 {job.location.city}</span>
        {job.distance !== null && job.distance !== undefined && (
          <span>📏 {job.distance.toFixed(1)} km away</span>
        )}
        <span>📅 {format(new Date(job.date), 'MMM dd, yyyy')}</span>
        <span>⏰ {job.startTime}</span>
        <span>⏱️ {job.durationHours} hrs</span>
      </div>
      {job.requesterId?.rating && (
        <div className="mt-3 text-sm text-primary-300">
          <span className="text-yellow-400">⭐</span>
          <span className="ml-1">
            {job.requesterId.rating.avg.toFixed(1)} ({job.requesterId.rating.count} reviews)
          </span>
        </div>
      )}
    </Link>
  );
}

