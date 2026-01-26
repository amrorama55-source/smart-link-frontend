import { useState } from 'react';
import { 
  ArrowLeft, HelpCircle, ChevronDown, ChevronUp, 
  Link2, Target, QrCode, Shield, CreditCard, Users,
  Search, CheckCircle, MessageCircle
} from 'lucide-react';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState([0]);

  const toggleItem = (index) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      category: 'Getting Started',
      icon: Link2,
      color: 'from-blue-600 to-indigo-600',
      questions: [
        {
          question: 'What is Smart Link?',
          answer: 'Smart Link is a powerful URL shortening and link management platform that helps you create professional bio pages, track analytics, and optimize your links with advanced features like A/B testing, geo-targeting, and QR code generation.'
        },
        {
          question: 'How do I get started?',
          answer: 'Getting started is easy! Simply sign up for a free account, add your links or create your bio page, and share your unique Smart Link. You can start tracking clicks and analytics immediately.'
        },
        {
          question: 'Is Smart Link really free?',
          answer: 'Yes! We offer a forever-free plan with unlimited links, basic analytics, bio pages, and QR codes. You can upgrade to Pro or Business plans for advanced features like custom domains, A/B testing, and more.'
        },
        {
          question: 'Do I need a credit card to sign up?',
          answer: 'No credit card required! You can start using Smart Link completely free. We only ask for payment information when you choose to upgrade to a paid plan.'
        }
      ]
    },
    {
      category: 'Features & Capabilities',
      icon: Target,
      color: 'from-purple-600 to-pink-600',
      questions: [
        {
          question: 'What is A/B testing and how does it work?',
          answer: 'A/B testing allows you to test multiple destination URLs with a single short link. Traffic is automatically split between variants, and you can track which performs better. Our auto-optimization feature can even automatically send more traffic to winning variants.'
        },
        {
          question: 'Can I use my own custom domain?',
          answer: 'Yes! Pro and Business plan users can connect their own custom domains for branded short links. Simply add a CNAME record in your DNS settings, and we\'ll handle the rest, including SSL certificates.'
        },
        {
          question: 'What is geo-targeting?',
          answer: 'Geo-targeting lets you redirect users to different URLs based on their country. Perfect for international campaigns, regional content, or localized marketing. You can set up multiple rules with different priority levels.'
        },
        {
          question: 'How does device targeting work?',
          answer: 'Device targeting automatically detects if a user is on mobile, desktop, or tablet and redirects them to the appropriate URL. Great for sending mobile users to app stores and desktop users to your website.'
        },
        {
          question: 'What analytics do you provide?',
          answer: 'We provide comprehensive analytics including: total clicks, unique visitors, click-through rates, geographic data, device types, browsers, referrer sources, and time-based trends. All data is updated in real-time.'
        }
      ]
    },
    {
      category: 'Bio Pages',
      icon: Users,
      color: 'from-green-600 to-emerald-600',
      questions: [
        {
          question: 'What is a Bio Page?',
          answer: 'A Bio Page is your personal landing page that houses all your important links in one place. It\'s like Linktree but with more customization options, analytics, and advanced features. Perfect for social media bios.'
        },
        {
          question: 'Can I customize my Bio Page design?',
          answer: 'Yes! Choose from 8 beautiful themes including Default, Dark, Gradient, Minimal, Neon, Ocean, Sunset, and Forest. You can also add custom avatars, bio text, social links, and organize your links with custom icons.'
        },
        {
          question: 'Can I track Bio Page visits?',
          answer: 'Yes! Every Bio Page comes with detailed analytics showing total views, link clicks, popular links, visitor locations, and more. You can see which links your audience engages with most.'
        }
      ]
    },
    {
      category: 'QR Codes',
      icon: QrCode,
      color: 'from-orange-600 to-red-600',
      questions: [
        {
          question: 'Can I create QR codes for my links?',
          answer: 'Yes! Every link and Bio Page can generate a beautiful QR code instantly. You can customize colors and download high-resolution PNG files perfect for print materials.'
        },
        {
          question: 'Do QR codes track scans?',
          answer: 'Absolutely! When someone scans your QR code, it counts as a regular click and appears in your analytics. You can see how many people scanned your code and where they\'re from.'
        }
      ]
    },
    {
      category: 'Security & Privacy',
      icon: Shield,
      color: 'from-cyan-600 to-blue-600',
      questions: [
        {
          question: 'Is my data secure?',
          answer: 'Yes! We use industry-standard encryption (SSL/HTTPS), secure password hashing (bcrypt), and follow best security practices. We never sell your personal information.'
        },
        {
          question: 'Can I password-protect my links?',
          answer: 'Yes! You can add password protection to any link. Users will need to enter the password before accessing the destination URL. Great for exclusive content or internal links.'
        },
        {
          question: 'Can I delete my account and data?',
          answer: 'Yes, you can delete your account anytime from your settings. All your data will be permanently removed within 30 days in compliance with privacy regulations.'
        }
      ]
    },
    {
      category: 'Pricing & Billing',
      icon: CreditCard,
      color: 'from-yellow-600 to-orange-600',
      questions: [
        {
          question: 'What\'s included in the Free plan?',
          answer: 'The Free plan includes unlimited links, bio pages, basic analytics, QR code generation, and community support. Perfect for personal use and getting started.'
        },
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes! You can cancel your subscription at any time. You\'ll continue to have access to paid features until the end of your billing period. No questions asked.'
        },
        {
          question: 'Can I switch between plans?',
          answer: 'Absolutely! You can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately, and billing is prorated.'
        }
      ]
    },
    {
      category: 'Technical & Support',
      icon: MessageCircle,
      color: 'from-indigo-600 to-purple-600',
      questions: [
        {
          question: 'What browsers are supported?',
          answer: 'Smart Link works on all modern browsers including Chrome, Firefox, Safari, Edge, and their mobile versions. We recommend keeping your browser updated for the best experience.'
        },
        {
          question: 'How do I contact support?',
          answer: 'Free users get community support. Pro users get priority email support with 24-48 hour response time. Business users get dedicated support. Email us at smartlinkpro10@gmail.com'
        },
        {
          question: 'Do you offer team collaboration?',
          answer: 'Yes! Business plan includes team collaboration features where multiple team members can manage links, share analytics, and work together on campaigns.'
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-black p-4 sm:p-6 lg:p-8">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl mb-6 shadow-2xl">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            Frequently Asked
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to know about Smart Link
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 transition-all shadow-lg"
            />
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-8">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                
                <div className={`p-6 bg-gradient-to-r ${category.color}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {category.category}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {category.questions.length} questions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {category.questions.map((item, index) => {
                    const globalIndex = categoryIndex * 100 + index;
                    const isOpen = openItems.includes(globalIndex);
                    
                    return (
                      <div key={index}>
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full px-6 py-5 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isOpen 
                                ? 'bg-gradient-to-r ' + category.color
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                              {isOpen ? (
                                <CheckCircle className="w-4 h-4 text-white" />
                              ) : (
                                <span className="text-xs font-bold text-gray-500">?</span>
                              )}
                            </div>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                              {item.question}
                            </span>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-5 pl-15">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try different keywords
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 sm:p-12 text-center text-white">
          <MessageCircle className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you.
          </p>
          <a
            href="mailto:smartlinkpro10@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}