import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-sage-dark hover:text-sage-medium transition-colors">
            <span className="text-2xl">🏠</span>
            <span>Hire Nearby</span>
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/browse" className="text-gray-700 hover:text-sage-dark font-medium text-sm transition-colors px-3 py-1.5 rounded hover:bg-gray-50">Browse Jobs</Link>
                {user.role === 'requester' && (
                  <Link to="/post-job" className="text-gray-700 hover:text-sage-dark font-medium text-sm transition-colors px-3 py-1.5 rounded hover:bg-gray-50">Post Job</Link>
                )}
                {user.role === 'requester' && (
                  <Link to="/dashboard/requester" className="text-gray-700 hover:text-sage-dark font-medium text-sm transition-colors px-3 py-1.5 rounded hover:bg-gray-50">Dashboard</Link>
                )}
                {user.role === 'provider' && (
                  <Link to="/dashboard/provider" className="text-gray-700 hover:text-sage-dark font-medium text-sm transition-colors px-3 py-1.5 rounded hover:bg-gray-50">Dashboard</Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/dashboard/admin" className="text-gray-700 hover:text-sage-dark font-medium text-sm transition-colors px-3 py-1.5 rounded hover:bg-gray-50">Admin</Link>
                )}
                <Link to="/profile" className="text-gray-700 hover:text-sage-dark font-medium text-sm transition-colors px-3 py-1.5 rounded hover:bg-gray-50">Profile</Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-sage-dark font-medium text-sm transition-colors px-3 py-1.5 rounded hover:bg-gray-50">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/browse" className="text-gray-700 hover:text-sage-dark font-medium text-sm transition-colors px-3 py-1.5 rounded hover:bg-gray-50">Browse Jobs</Link>
                <Link to="/login" className="text-gray-700 hover:text-sage-dark font-medium text-sm transition-colors px-3 py-1.5 rounded hover:bg-gray-50">Login</Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

