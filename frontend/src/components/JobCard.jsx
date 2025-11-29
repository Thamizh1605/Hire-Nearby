import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function JobCard({ job }) {
  const categoryColors = {
    cleaning: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
    cooking: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
    tutoring: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300'
  };

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block card p-6 group"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-sage-dark group-hover:text-sage-medium transition-colors duration-200">{job.title}</h3>
        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${categoryColors[job.category]}`}>
          {job.category}
        </span>
      </div>
      <p className="text-sage-medium mb-5 line-clamp-2 leading-relaxed">{job.description}</p>
      <div className="flex flex-wrap gap-4 text-sm text-sage-dark mb-4">
        <span className="flex items-center gap-1.5">
          <span className="text-sage-medium">📍</span> {job.location.city}
        </span>
        {job.distance !== null && job.distance !== undefined && (
          <span className="flex items-center gap-1.5">
            <span className="text-sage-medium">📏</span> {job.distance.toFixed(1)} km
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <span className="text-sage-medium">📅</span> {format(new Date(job.date), 'MMM dd, yyyy')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-sage-medium">⏰</span> {job.startTime}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-sage-medium">⏱️</span> {job.durationHours} hrs
        </span>
      </div>
      {job.requesterId?.rating && (
        <div className="mt-4 pt-4 border-t border-sage-light flex items-center gap-2">
          <span className="text-yellow-500 text-lg">⭐</span>
          <span className="text-sage-dark font-semibold">
            {job.requesterId.rating.avg.toFixed(1)}
          </span>
          <span className="text-sage-medium text-sm">
            ({job.requesterId.rating.count} reviews)
          </span>
        </div>
      )}
    </Link>
  );
}

