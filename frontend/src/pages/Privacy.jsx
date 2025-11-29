export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-dark-400 border border-primary-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary-400">Privacy & Data Policy</h1>
        
        <div className="space-y-6 text-primary-300">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-primary-400">What We Store</h2>
            <p className="mb-2">We respect your privacy and only store minimal necessary information:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-primary-400">
              <li><strong className="text-primary-300">Name</strong> - Your display name</li>
              <li><strong className="text-primary-300">Email</strong> - For account authentication</li>
              <li><strong className="text-primary-300">City</strong> - Your city location</li>
              <li><strong className="text-primary-300">Approximate Location</strong> - Latitude and longitude rounded to 3 decimal places (~100m accuracy)</li>
              <li><strong className="text-primary-300">Password Hash</strong> - Securely hashed using bcrypt</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-primary-400">What We DON'T Store</h2>
            <ul className="list-disc list-inside space-y-1 ml-4 text-primary-400">
              <li>Phone numbers</li>
              <li>National ID or government identification</li>
              <li>Exact street addresses</li>
              <li>Credit card information</li>
              <li>Any other personal identifying information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-primary-400">Location Privacy</h2>
            <p>
              We round latitude and longitude coordinates to 3 decimal places, which provides approximately 100-meter accuracy.
              This allows us to calculate distances for job matching while protecting your exact location.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-primary-400">Security</h2>
            <p>
              All passwords are hashed using bcrypt before storage. We use JWT tokens for authentication
              with a 7-day expiration. All API communications should use HTTPS in production.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-primary-400">Contact</h2>
            <p>
              If you have questions about our privacy practices, please contact us through the platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

