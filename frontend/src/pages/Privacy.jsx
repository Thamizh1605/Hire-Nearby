export default function Privacy() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto card p-10">
        <h1 className="section-title mb-8">Privacy & Data Policy</h1>
        
        <div className="space-y-8 text-sage-dark leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-sage-dark">What We Store</h2>
            <p className="mb-4 text-sage-medium">We respect your privacy and only store minimal necessary information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-sage-medium">
              <li><strong className="text-sage-dark">Name</strong> - Your display name</li>
              <li><strong className="text-sage-dark">Email</strong> - For account authentication</li>
              <li><strong className="text-sage-dark">City</strong> - Your city location</li>
              <li><strong className="text-sage-dark">Approximate Location</strong> - Latitude and longitude rounded to 3 decimal places (~100m accuracy)</li>
              <li><strong className="text-sage-dark">Password Hash</strong> - Securely hashed using bcrypt</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-sage-dark">What We DON'T Store</h2>
            <ul className="list-disc list-inside space-y-2 ml-4 text-sage-medium">
              <li>Phone numbers</li>
              <li>National ID or government identification</li>
              <li>Exact street addresses</li>
              <li>Credit card information</li>
              <li>Any other personal identifying information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-sage-dark">Location Privacy</h2>
            <p className="text-sage-medium">
              We round latitude and longitude coordinates to 3 decimal places, which provides approximately 100-meter accuracy.
              This allows us to calculate distances for job matching while protecting your exact location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-sage-dark">Security</h2>
            <p className="text-sage-medium">
              All passwords are hashed using bcrypt before storage. We use JWT tokens for authentication
              with a 7-day expiration. All API communications should use HTTPS in production.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-sage-dark">Contact</h2>
            <p className="text-sage-medium">
              If you have questions about our privacy practices, please contact us through the platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

