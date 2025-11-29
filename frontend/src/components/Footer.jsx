import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white/60 backdrop-blur-sm border-t border-sage-light mt-auto py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-sage-medium to-sage-dark bg-clip-text text-transparent">Hire Nearby</h3>
            <p className="text-sage-medium leading-relaxed">
              Connecting local service providers with customers in your area.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sage-dark text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sage-medium">
              <li><Link to="/browse" className="hover:text-sage-dark transition-colors duration-200">Browse Jobs</Link></li>
              <li><Link to="/privacy" className="hover:text-sage-dark transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sage-dark text-lg">About</h4>
            <p className="text-sage-medium leading-relaxed">
              We respect your privacy. We only store name, city, and approximate location.
              No phone numbers or personal addresses are stored.
            </p>
          </div>
        </div>
        <div className="border-t border-sage-light mt-10 pt-6 text-center text-sage-medium">
          <p>&copy; 2024 Hire Nearby. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

