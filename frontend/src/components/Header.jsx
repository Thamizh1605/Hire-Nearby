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
    <header className="bg-dark-500 border-b border-primary-800 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-400">
            🏠 Hire Nearby
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/browse" className="text-primary-200 hover:text-primary-400 transition">Browse Jobs</Link>
                {user.role === 'requester' && (
                  <Link to="/post-job" className="text-primary-200 hover:text-primary-400 transition">Post Job</Link>
                )}
                {user.role === 'requester' && (
                  <Link to="/dashboard/requester" className="text-primary-200 hover:text-primary-400 transition">Dashboard</Link>
                )}
                {user.role === 'provider' && (
                  <Link to="/dashboard/provider" className="text-primary-200 hover:text-primary-400 transition">Dashboard</Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/dashboard/admin" className="text-primary-200 hover:text-primary-400 transition">Admin</Link>
                )}
                <Link to="/profile" className="text-primary-200 hover:text-primary-400 transition">Profile</Link>
                <button onClick={handleLogout} className="text-primary-200 hover:text-primary-400 transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/browse" className="text-primary-200 hover:text-primary-400 transition">Browse Jobs</Link>
                <Link to="/login" className="text-primary-200 hover:text-primary-400 transition">Login</Link>
                <Link
                  to="/register"
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-400 transition font-medium"
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

