import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-500 border-t border-primary-800 text-primary-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-400">Hire Nearby</h3>
            <p className="text-primary-300">
              Connecting local service providers with customers in your area.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-primary-400">Quick Links</h4>
            <ul className="space-y-2 text-primary-300">
              <li><Link to="/browse" className="hover:text-primary-400 transition">Browse Jobs</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-400 transition">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-primary-400">About</h4>
            <p className="text-primary-300">
              We respect your privacy. We only store name, city, and approximate location.
              No phone numbers or personal addresses are stored.
            </p>
          </div>
        </div>
        <div className="border-t border-primary-800 mt-8 pt-4 text-center text-primary-300">
          <p>&copy; 2024 Hire Nearby. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

