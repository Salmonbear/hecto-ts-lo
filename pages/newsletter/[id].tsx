import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';

interface Newsletter {
  id: string;
  logo: string;
  title: string;
  description: string;
  longDescription: string;
  subscribers: number;
  openRate: number;
  clickRate: number;
  categories: string[];
  price: number;
  frequency: string;
  audience: string;
}

// Hardcoded newsletter data
const NEWSLETTERS: Record<string, Newsletter> = {
  'hometalk': {
    id: 'hometalk',
    logo: '/logos/hometalk.png',
    title: 'Hometalk',
    description: 'empower people to create the home the love!',
    longDescription: 'We send weekly emails to the employees of almost every church in the United States. We sell website and mobile app services to the churches. But, we have room in our weekly newsletter to promote, reference, or write about other products. Our email list consists of the church staff at the churches. Our list consists of the mainline Protestant and Catholic Churches.',
    subscribers: 2500000,
    openRate: 39,
    clickRate: 0,
    categories: ['Design', 'Lifestyle'],
    price: 2000,
    frequency: 'weekly',
    audience: 'Home Improvement Enthusiasts',
  },
  'church-solutions': {
    id: 'church-solutions',
    logo: '/logos/church.png',
    title: 'Church Solutions Company',
    description: 'Product Promotion and Tips for Church Staff',
    longDescription: 'We send weekly emails to the employees of almost every church in the United States. We sell website and mobile app services to the churches. But, we have room in our weekly newsletter to promote, reference, or write about other products. Our email list consists of the church staff at the churches. Our list consists of the mainline Protestant and Catholic Churches.',
    subscribers: 200000,
    openRate: 15,
    clickRate: 1,
    categories: ['Lifestyle'],
    price: 500,
    frequency: 'monthly',
    audience: 'Church Employees',
  },
  'foodtalk': {
    id: 'foodtalk',
    logo: '/logos/foodtalk.png',
    title: 'Foodtalk',
    description: 'The best platform for anyone, foodie or newbie, to broaden their palate and add more, different dish',
    longDescription: 'Connect with food lovers and discover new recipes, restaurants, and culinary experiences.',
    subscribers: 1230000,
    openRate: 37,
    clickRate: 0,
    categories: ['Lifestyle', 'Food'],
    price: 2500,
    frequency: 'weekly',
    audience: 'Food Enthusiasts',
  },
  'white-space': {
    id: 'white-space',
    logo: '/logos/mightydeals.png',
    title: 'White Space by MightyDeals.com',
    description: 'White Space breaks down the hottest design tricks and trends and covers industry news.',
    longDescription: 'Stay updated with the latest design trends, tools, and industry insights.',
    subscribers: 1300000,
    openRate: 25,
    clickRate: 2,
    categories: ['Design', 'Remote Work', 'Marketing'],
    price: 1500,
    frequency: 'weekly',
    audience: 'Designers and Creatives',
  },
  'upstyle': {
    id: 'upstyle',
    logo: '/logos/upstyle.png',
    title: 'Upstyle',
    description: 'We help you create things that make you look good and feel gorgeous!',
    longDescription: 'Fashion tips, style guides, and beauty advice for everyone.',
    subscribers: 1140000,
    openRate: 34,
    clickRate: 0,
    categories: ['Fashion', 'Design'],
    price: 1500,
    frequency: 'weekly',
    audience: 'Fashion Enthusiasts',
  },
  'gma': {
    id: 'gma',
    logo: '/logos/gma.png',
    title: 'Great Morning America',
    description: 'GREAT news delivered directly to your inbox.',
    longDescription: 'Start your day with positive news and inspiring stories.',
    subscribers: 800000,
    openRate: 23,
    clickRate: 14,
    categories: ['Lifestyle', 'Fun', 'Productivity'],
    price: 25000,
    frequency: 'daily',
    audience: 'Morning News Readers',
  },
  'codementor': {
    id: 'codementor',
    logo: '/logos/codementor.png',
    title: "Codementor's Newsletter",
    description: '',
    longDescription: 'Developer tips, tutorials, and coding best practices.',
    subscribers: 671771,
    openRate: 21,
    clickRate: 12,
    categories: ['Tech', 'Productivity'],
    price: 2000,
    frequency: 'weekly',
    audience: 'Software Developers',
  },
  'the-brief': {
    id: 'the-brief',
    logo: '/logos/thebrief.png',
    title: 'The Brief',
    description: 'Understand the world more accurately, efficiently and objectively.',
    longDescription: 'Unbiased news analysis and political insights.',
    subscribers: 500000,
    openRate: 23,
    clickRate: 0,
    categories: ['Politics'],
    price: 1500,
    frequency: 'daily',
    audience: 'News Consumers',
  },
  'skills-to-success': {
    id: 'skills-to-success',
    logo: '/logos/skills.png',
    title: 'Skills to Success Newsletter',
    description: 'We cover professional and personal development topics for your success',
    longDescription: 'Professional development tips and career growth strategies.',
    subscribers: 250000,
    openRate: 27,
    clickRate: 1,
    categories: [],
    price: 500,
    frequency: 'weekly',
    audience: 'Career Professionals',
  },
  'current-tech': {
    id: 'current-tech',
    logo: '/logos/currtech.png',
    title: 'The Current Tech News',
    description: 'The inside scoop on tech news that matters - in just 5 minutes a day. Headlines you need to stay in',
    longDescription: 'Daily tech news roundup for busy professionals.',
    subscribers: 232000,
    openRate: 0,
    clickRate: 0,
    categories: ['Tech', 'Lifestyle'],
    price: 2500,
    frequency: 'daily',
    audience: 'Tech Enthusiasts',
  },
};

export default function NewsletterDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const newsletter = NEWSLETTERS[id];

  if (!newsletter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Newsletter not found</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{newsletter.title} - Hecto</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Tailwind CDN */}
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <a href="/" className="text-2xl font-bold text-blue-600">
                  hecto.
                </a>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/creators" className="text-gray-700 hover:text-blue-600 font-medium">
                  Creators
                </a>
                <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium">
                  Blog
                </a>
                <a href="/search" className="text-gray-700 hover:text-blue-600 font-medium">
                  Search
                </a>
                <a href="/pricing" className="text-gray-700 hover:text-blue-600 font-medium">
                  Pricing
                </a>
              </nav>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-4">
                <a href="/signin" className="text-gray-700 hover:text-blue-600 font-medium">
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Newsletter Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            {/* Badge */}
            <div className="flex justify-end mb-4">
              <span className="bg-blue-900 text-white text-xs font-semibold px-3 py-1 rounded">
                Open to Cross Promotion
              </span>
            </div>

            {/* Logo and Title */}
            <div className="flex items-start space-x-6 mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {newsletter.title}
                </h1>
                <p className="text-gray-600">
                  {newsletter.description}
                </p>
              </div>
            </div>

            {/* Categories */}
            {newsletter.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {newsletter.categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-200 mb-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Subscribers</div>
                <div className="text-2xl font-bold text-gray-900">
                  {newsletter.subscribers.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Open Rate</div>
                <div className="text-2xl font-bold text-gray-900">
                  {newsletter.openRate}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Click Rate</div>
                <div className="text-2xl font-bold text-gray-900">
                  {newsletter.clickRate}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Frequency</div>
                <div className="text-2xl font-bold text-gray-900 capitalize">
                  {newsletter.frequency}
                </div>
              </div>
            </div>

            {/* Contact Button */}
            <div className="mb-6">
              <button className="w-full md:w-auto px-6 py-3 border-2 border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Contact
              </button>
            </div>

            {/* Long Description */}
            {newsletter.longDescription && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {newsletter.longDescription}
                </p>
              </div>
            )}

            {/* Audience */}
            {newsletter.audience && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">*Audience:</h3>
                <p className="text-gray-600">{newsletter.audience}</p>
              </div>
            )}

            {/* Min Sponsorship Package */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Min Sponsorship Package</span>
                <span className="text-xl font-bold text-gray-900">${newsletter.price}</span>
              </div>
            </div>
          </div>

          {/* Send A Message Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send A Message</h2>

            <form className="space-y-6">
              {/* Your Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>

              {/* Your Contact Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Contact Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Type here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>

              {/* Your Enquiry */}
              <div>
                <label htmlFor="enquiry" className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Enquiry
                </label>
                <textarea
                  id="enquiry"
                  rows={6}
                  placeholder="Explain the campaign you're currently working and how you would like to work with Church Solutions Company"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                  disabled
                />
              </div>

              {/* Submit Button (Disabled) */}
              <div>
                <button
                  type="button"
                  onClick={() => router.push('https://app.hecto.io/login')}
                  className="w-full bg-gray-400 text-white px-6 py-3 rounded-md font-semibold cursor-pointer hover:bg-gray-500 transition-colors"
                >
                  Log In Required
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                © Hecto 2025
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="/terms" className="text-gray-400 hover:text-white">Terms</a>
                <a href="/privacy" className="text-gray-400 hover:text-white">Privacy</a>
                <a href="/contact" className="text-gray-400 hover:text-white">Contact</a>
                <a href="/blog" className="text-gray-400 hover:text-white">Blog</a>
              </div>
              <div>
                <a href="https://twitter.com" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
