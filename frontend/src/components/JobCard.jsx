import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function JobCard({ job }) {
  const categoryColors = {
    cleaning: 'bg-blue-50 text-blue-700',
    cooking: 'bg-green-50 text-green-700',
    tutoring: 'bg-purple-50 text-purple-700'
  };

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block card p-4 group"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-sage-dark transition-colors flex-1 pr-2">{job.title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide flex-shrink-0 ${categoryColors[job.category]}`}>
          {job.category}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{job.description}</p>
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <span>📍</span> {job.location.city}
        </span>
        {job.distance !== null && job.distance !== undefined && (
          <span className="flex items-center gap-1">
            <span>📏</span> {job.distance.toFixed(1)} km
          </span>
        )}
        <span className="flex items-center gap-1">
          <span>📅</span> {format(new Date(job.date), 'MMM dd')}
        </span>
        <span className="flex items-center gap-1">
          <span>⏰</span> {job.startTime}
        </span>
        <span className="flex items-center gap-1">
          <span>⏱️</span> {job.durationHours}h
        </span>
      </div>
      {job.requesterId?.rating && (
        <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
          <span className="text-yellow-500 text-sm">⭐</span>
          <span className="text-sm font-semibold text-gray-900">
            {job.requesterId.rating.avg.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">
            ({job.requesterId.rating.count})
          </span>
        </div>
      )}
    </Link>
  );
}

