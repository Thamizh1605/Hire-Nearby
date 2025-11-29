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
    <header className="bg-white/80 backdrop-blur-md border-b border-sage-light shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-sage-medium to-sage-dark bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
            🏠 Hire Nearby
          </Link>
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/browse" className="text-sage-dark font-medium hover:text-sage-medium transition-colors duration-200">Browse Jobs</Link>
                {user.role === 'requester' && (
                  <Link to="/post-job" className="text-sage-dark font-medium hover:text-sage-medium transition-colors duration-200">Post Job</Link>
                )}
                {user.role === 'requester' && (
                  <Link to="/dashboard/requester" className="text-sage-dark font-medium hover:text-sage-medium transition-colors duration-200">Dashboard</Link>
                )}
                {user.role === 'provider' && (
                  <Link to="/dashboard/provider" className="text-sage-dark font-medium hover:text-sage-medium transition-colors duration-200">Dashboard</Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/dashboard/admin" className="text-sage-dark font-medium hover:text-sage-medium transition-colors duration-200">Admin</Link>
                )}
                <Link to="/profile" className="text-sage-dark font-medium hover:text-sage-medium transition-colors duration-200">Profile</Link>
                <button onClick={handleLogout} className="text-sage-dark font-medium hover:text-sage-medium transition-colors duration-200">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/browse" className="text-sage-dark font-medium hover:text-sage-medium transition-colors duration-200">Browse Jobs</Link>
                <Link to="/login" className="text-sage-dark font-medium hover:text-sage-medium transition-colors duration-200">Login</Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
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

