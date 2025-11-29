import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-sage-medium via-sage-dark to-sage-medium bg-clip-text text-transparent">
            Hire Nearby
          </h1>
          <p className="text-2xl mb-10 text-sage-dark font-medium">
            Connect with local service providers in your area
          </p>
          {!user && (
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary text-lg px-10 py-4"
              >
                Get Started
              </Link>
              <Link
                to="/browse"
                className="btn-secondary text-lg px-10 py-4"
              >
                Browse Jobs
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="card p-8 text-center group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📋</div>
            <h3 className="text-2xl font-bold mb-4 text-sage-dark">Post a Job</h3>
            <p className="text-sage-medium leading-relaxed">
              Need help? Post your job and get offers from qualified providers nearby.
            </p>
          </div>
          <div className="card p-8 text-center group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🔍</div>
            <h3 className="text-2xl font-bold mb-4 text-sage-dark">Find Work</h3>
            <p className="text-sage-medium leading-relaxed">
              Browse available jobs in your area and make offers to get hired.
            </p>
          </div>
          <div className="card p-8 text-center group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🤝</div>
            <h3 className="text-2xl font-bold mb-4 text-sage-dark">Get Paid</h3>
            <p className="text-sage-medium leading-relaxed">
              Complete jobs, get paid securely, and build your reputation.
            </p>
          </div>
        </div>

        <div className="card p-10 mb-12">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sage-light to-sage-medium rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-soft">
                1
              </div>
              <p className="text-sage-dark font-medium">Sign up as Requester or Provider</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sage-light to-sage-medium rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-soft">
                2
              </div>
              <p className="text-sage-dark font-medium">Post or browse jobs in your area</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sage-light to-sage-medium rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-soft">
                3
              </div>
              <p className="text-sage-dark font-medium">Connect and communicate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sage-light to-sage-medium rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-soft">
                4
              </div>
              <p className="text-sage-dark font-medium">Complete work and get paid</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/privacy"
            className="text-sage-medium hover:text-sage-dark underline font-medium transition-colors duration-200"
          >
            Learn about our privacy policy
          </Link>
        </div>
      </div>
    </div>
  );
}

