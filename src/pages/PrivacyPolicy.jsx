export default function PrivacyPolicy() {
  return (
    <div className="min-h-[100dvh]bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 lg:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: December 27, 2024</p>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Smart Link ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and protect your information when you use our URL shortening service.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Account information (name, email address, password)</li>
              <li>Links you create and their metadata (titles, descriptions, tags)</li>
              <li>Bio page content and customizations</li>
              <li>Payment information (processed securely through third-party providers)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Click data (IP addresses, device type, browser, operating system)</li>
              <li>Geographic location (country and city based on IP)</li>
              <li>Referrer information (where clicks came from)</li>
              <li>Usage statistics and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">We use the collected information for:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Providing and maintaining our service</li>
              <li>Creating and managing your account</li>
              <li>Processing your transactions</li>
              <li>Generating analytics and insights for your links</li>
              <li>Improving our service and developing new features</li>
              <li>Sending service-related notifications</li>
              <li>Preventing fraud and abuse</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-3">We do not sell your personal information. We may share your data with:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Service Providers:</strong> Third-party companies that help us operate our service (hosting, analytics, payment processing)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We ensure all third parties agree to protect your data in accordance with this policy.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
              <li>Encryption of data in transit (HTTPS/SSL)</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure cloud infrastructure (Railway, MongoDB Atlas)</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Object:</strong> Object to certain types of data processing</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, please contact us at <a href="mailto:privacy@smart-link.website" className="text-blue-600 hover:underline">privacy@smart-link.website</a>
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze site traffic and usage</li>
              <li>Improve user experience</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can control cookies through your browser settings. Note that disabling cookies may affect service functionality.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal data for as long as necessary to provide our services and comply with legal obligations. 
              When you delete your account, we remove your personal information within 30 days, except where we're required to retain it by law.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for users under 13 years of age. We do not knowingly collect personal information from children. 
              If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place 
              to protect your data in accordance with this privacy policy.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of significant changes by email or through our service. 
              The "Last updated" date at the top indicates when the policy was last revised.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you have questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:privacy@smart-link.website" className="text-blue-600 hover:underline">privacy@smart-link.website</a></p>
              <p className="text-gray-700 mt-2"><strong>Website:</strong> <a href="https://www.smart-link.website" className="text-blue-600 hover:underline">www.smart-link.website</a></p>
            </div>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}