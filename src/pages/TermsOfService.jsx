export default function TermsOfService() {
  return (
    <div className="min-h-[100dvh]bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 lg:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: December 27, 2024</p>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Agreement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Smart Link ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-700 leading-relaxed">
              Smart Link provides URL shortening, link management, QR code generation, bio page creation, and analytics services. 
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Registration</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use certain features, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Update your information as needed</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.2 Account Security</h3>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for maintaining the confidentiality of your password. 
              Notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
            <p className="text-gray-700 mb-3">You agree NOT to use the Service to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Share malicious links (malware, phishing, viruses)</li>
              <li>Promote illegal activities or content</li>
              <li>Infringe on intellectual property rights</li>
              <li>Harass, abuse, or harm others</li>
              <li>Spam or send unsolicited messages</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Circumvent security measures</li>
              <li>Share adult or explicit content without warnings</li>
              <li>Impersonate others or misrepresent affiliation</li>
            </ul>
          </section>

          {/* Link Management */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Link Management and Content</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain all rights to the content you create through our Service. However, you grant us a license to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Store and display your links and bio pages</li>
              <li>Process clicks and generate analytics</li>
              <li>Create QR codes for your links</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We reserve the right to remove or disable links that violate these Terms without prior notice.
            </p>
          </section>

          {/* Subscription Plans */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Subscription Plans and Payments</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Free Plan</h3>
            <p className="text-gray-700 leading-relaxed">
              Our Free plan is available at no cost with limitations on features and usage.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.2 Paid Plans</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Subscriptions are billed monthly or annually</li>
              <li>Payments are processed securely through third-party providers</li>
              <li>Fees are non-refundable except as required by law</li>
              <li>We may change pricing with 30 days notice</li>
              <li>You can cancel anytime; access continues until period end</li>
            </ul>
          </section>

          {/* Service Limitations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Service Limitations</h2>
            <p className="text-gray-700 mb-3">We provide the Service "as is" with the following limitations:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>We don't guarantee 100% uptime or error-free service</li>
              <li>Analytics may have minor inaccuracies</li>
              <li>Links may be temporarily unavailable during maintenance</li>
              <li>We may impose rate limits to prevent abuse</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service, including its design, features, code, and branding, is owned by Smart Link and protected by intellectual property laws. 
              You may not copy, modify, or distribute our Service without permission.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 By You</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may delete your account at any time through your settings.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 By Us</h3>
            <p className="text-gray-700 leading-relaxed">
              We may suspend or terminate your account if you violate these Terms or for any reason with notice when possible.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disclaimer of Warranties</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-gray-800 font-medium">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. 
                WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SMART LINK SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold Smart Link harmless from any claims, damages, or expenses arising from 
              your use of the Service or violation of these Terms.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may modify these Terms at any time. Significant changes will be communicated via email or service notification. 
              Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of [Your Jurisdiction]. Any disputes shall be resolved in the courts of [Your Jurisdiction].
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              For questions about these Terms, contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:support@smart-link.website" className="text-blue-600 hover:underline">support@smart-link.website</a></p>
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