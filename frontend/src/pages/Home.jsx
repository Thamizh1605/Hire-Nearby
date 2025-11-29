import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-br from-dark-500 via-dark-400 to-dark-500 text-primary-200 min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-primary-400">Hire Nearby</h1>
          <p className="text-xl mb-8 text-primary-300">
            Connect with local service providers in your area
          </p>
          {!user && (
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/browse"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-500 transition shadow-lg border border-primary-400"
              >
                Browse Jobs
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-dark-400 border border-primary-800 rounded-lg p-6 hover:border-primary-600 transition">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2 text-primary-400">Post a Job</h3>
            <p className="text-primary-300">
              Need help? Post your job and get offers from qualified providers nearby.
            </p>
          </div>
          <div className="bg-dark-400 border border-primary-800 rounded-lg p-6 hover:border-primary-600 transition">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-primary-400">Find Work</h3>
            <p className="text-primary-300">
              Browse available jobs in your area and make offers to get hired.
            </p>
          </div>
          <div className="bg-dark-400 border border-primary-800 rounded-lg p-6 hover:border-primary-600 transition">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2 text-primary-400">Get Paid</h3>
            <p className="text-primary-300">
              Complete jobs, get paid securely, and build your reputation.
            </p>
          </div>
        </div>

        <div className="bg-dark-400 border border-primary-800 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary-400">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">1</div>
              <p className="text-primary-300">Sign up as Requester or Provider</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">2</div>
              <p className="text-primary-300">Post or browse jobs in your area</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">3</div>
              <p className="text-primary-300">Connect and communicate</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">4</div>
              <p className="text-primary-300">Complete work and get paid</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/privacy"
            className="text-primary-400 hover:text-primary-300 underline transition"
          >
            Learn about our privacy policy
          </Link>
        </div>
      </div>
    </div>
  );
}

