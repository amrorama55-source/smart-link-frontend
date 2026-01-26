import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, FileText, AlertCircle, CheckCircle, XCircle,
  Scale, Shield, Users, Lock, CreditCard, Trash2,
  Mail, ExternalLink, Calendar, Eye
} from 'lucide-react';

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: 1,
      icon: FileText,
      title: 'Agreement to Terms',
      color: 'from-blue-600 to-blue-800',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            By accessing and using Smart Link ("Service"), you agree to be bound by these Terms of Service ("Terms").
            If you disagree with any part of these terms, you may not access the Service.
          </p>
          <p className="text-sm text-blue-300 font-medium">
            ✓ Continued use of our service means you accept these terms
          </p>
        </div>
      )
    },
    {
      id: 2,
      icon: Shield,
      title: 'Service Description',
      color: 'from-purple-600 to-purple-800',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed">
            Smart Link provides URL shortening, link management, QR code generation, bio page creation, and analytics services.
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>URL shortening and custom domains</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Analytics and click tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Bio pages and QR codes</span>
            </li>
          </ul>
          <p className="text-sm text-gray-400 italic">
            We reserve the right to modify, suspend, or discontinue any part of the Service at any time.
          </p>
        </div>
      )
    },
    {
      id: 3,
      icon: Users,
      title: 'User Accounts',
      color: 'from-green-600 to-green-800',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Registration Requirements
            </h3>
            <ul className="space-y-2 text-gray-300 ml-7">
              <li>• Provide accurate and complete information</li>
              <li>• Maintain the security of your account</li>
              <li>• Update your information as needed</li>
              <li>• Accept responsibility for all activities under your account</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-yellow-400" />
              Account Security
            </h3>
            <p className="text-gray-300 ml-7">
              You are responsible for maintaining the confidentiality of your password.
              Notify us immediately of any unauthorized use of your account.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      icon: XCircle,
      title: 'Acceptable Use',
      color: 'from-red-600 to-red-800',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 font-semibold">
            You agree NOT to use the Service to:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Share malicious links',
              'Promote illegal activities',
              'Infringe intellectual property',
              'Harass or harm others',
              'Send spam messages',
              'Violate laws/regulations',
              'Circumvent security',
              'Share adult content',
              'Impersonate others'
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 5,
      icon: Eye,
      title: 'Link Management & Content',
      color: 'from-indigo-600 to-indigo-800',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300">
            You retain all rights to the content you create. However, you grant us a license to:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Store and display your links and bio pages</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Process clicks and generate analytics</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Create QR codes for your links</span>
            </li>
          </ul>
          <p className="text-sm text-yellow-300 font-medium">
            ⚠️ We reserve the right to remove or disable links that violate these Terms without prior notice.
          </p>
        </div>
      )
    },
    {
      id: 6,
      icon: CreditCard,
      title: 'Subscription & Payments',
      color: 'from-teal-600 to-teal-800',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-white mb-2">Free Plan</h3>
            <p className="text-gray-300">
              Available at no cost with limitations on features and usage.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">Paid Plans</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Subscriptions are billed monthly or annually</li>
              <li>• Payments processed securely through third-party providers</li>
              <li>• Fees are non-refundable except as required by law</li>
              <li>• We may change pricing with 30 days notice</li>
              <li>• You can cancel anytime; access continues until period end</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 7,
      icon: AlertCircle,
      title: 'Service Limitations',
      color: 'from-orange-600 to-orange-800',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300">
            We provide the Service "as is" with the following limitations:
          </p>
          <div className="space-y-2">
            {[
              "We don't guarantee 100% uptime or error-free service",
              'Analytics may have minor inaccuracies',
              'Links may be temporarily unavailable during maintenance',
              'We may impose rate limits to prevent abuse'
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 8,
      icon: Scale,
      title: 'Intellectual Property',
      color: 'from-pink-600 to-pink-800',
      content: (
        <p className="text-gray-300 font-medium leading-relaxed">
          The Service, including its design, features, code, and branding, is owned by Smart Link and protected by intellectual property laws.
          You may not copy, modify, or distribute our Service without permission.
        </p>
      )
    },
    {
      id: 9,
      icon: Trash2,
      title: 'Termination',
      color: 'from-gray-600 to-gray-800',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-white mb-2">By You</h3>
            <p className="text-gray-300">
              You may delete your account at any time through your settings.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">By Us</h3>
            <p className="text-gray-300">
              We may suspend or terminate your account if you violate these Terms or for any reason with notice when possible.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 10,
      icon: Shield,
      title: 'Disclaimer & Liability',
      color: 'from-yellow-600 to-yellow-800',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 font-medium text-sm">
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
            WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
          </p>
          <p className="text-gray-300 font-medium text-sm">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, SMART LINK SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">

      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Last updated: December 27, 2024
          </p>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Please read these terms carefully before using Smart Link
          </p>
        </div>

        {/* Quick Summary */}
        <div className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Quick Summary
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Free to use with premium options</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">You own your content</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">No illegal content allowed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <div
                key={section.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => setActiveSection(isActive ? null : section.id)}
                  className="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {section.id}. {section.title}
                      </h3>
                    </div>
                  </div>
                  <div className={`transform transition-transform ${isActive ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isActive && (
                  <div className="px-6 pb-6 pt-0 animate-fadeIn">
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Important Sections */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">

          {/* Changes to Terms */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Changes to Terms
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  We may modify these Terms at any time. Significant changes will be communicated via email or service notification.
                </p>
              </div>
            </div>
          </div>

          {/* Governing Law */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Governing Law
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  These Terms are governed by applicable laws. Any disputes shall be resolved in the appropriate jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 p-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Questions About These Terms?
                </h3>
                <p className="text-blue-100 mb-3">
                  We're here to help. Contact us anytime.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="mailto:smartlinkpro10@gmail.com"
                    className="inline-flex items-center gap-2 text-white hover:text-blue-100 font-semibold"
                  >
                    <Mail className="w-4 h-4" />
                    smartlinkpro10@gmail.com
                  </a>
                  <a
                    href="https://www.smart-link.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white hover:text-blue-100 font-semibold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    www.smart-link.website
                  </a>
                </div>
              </div>
            </div>
            <Link
              to="/"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Back to Home
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By using Smart Link, you acknowledge that you have read and understood these Terms of Service
          </p>
        </div>

      </div>
    </div>
  );
}