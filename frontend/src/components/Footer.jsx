import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Hire Nearby</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Connecting local service providers with customers in your area.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-900 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="text-gray-600 hover:text-gray-900 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-900 text-sm">About</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              We respect your privacy. We only store name, city, and approximate location.
              No phone numbers or personal addresses are stored.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 Hire Nearby. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

