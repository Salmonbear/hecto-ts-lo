import { useState, useMemo } from 'react';
import Head from 'next/head';
import Script from 'next/script';

interface Opportunity {
  id: string;
  logo: string;
  title: string;
  description: string;
  creatorName: string;
  subscribers: number;
  openRate: number;
  clickRate: number;
  categories: string[];
  price: number;
  frequency: string;
}

// Hardcoded newsletter data
const NEWSLETTERS: Opportunity[] = [
  {
    id: 'hometalk',
    logo: '/logos/hometalk.png',
    title: 'Hometalk',
    description: 'empower people to create the home the love!',
    creatorName: 'Hometalk',
    subscribers: 2500000,
    openRate: 39,
    clickRate: 0,
    categories: ['Design', 'Lifestyle'],
    price: 2000,
    frequency: 'weekly',
  },
  {
    id: 'foodtalk',
    logo: '/logos/foodtalk.png',
    title: 'Foodtalk',
    description: 'The best platform for anyone, foodie or newbie, to broaden their palate and add more, different dish',
    creatorName: 'Foodtalk',
    subscribers: 1230000,
    openRate: 37,
    clickRate: 0,
    categories: ['Lifestyle', 'Food'],
    price: 2500,
    frequency: 'weekly',
  },
  {
    id: 'white-space',
    logo: '/logos/mightydeals.png',
    title: 'White Space by MightyDeals.com',
    description: 'White Space breaks down the hottest design tricks and trends and covers industry news.',
    creatorName: 'MightyDeals',
    subscribers: 1300000,
    openRate: 25,
    clickRate: 2,
    categories: ['Design', 'Remote Work', 'Marketing'],
    price: 1500,
    frequency: 'weekly',
  },
  {
    id: 'upstyle',
    logo: '/logos/upstyle.png',
    title: 'Upstyle',
    description: 'We help you create things that make you look good and feel gorgeous!',
    creatorName: 'Upstyle',
    subscribers: 1140000,
    openRate: 34,
    clickRate: 0,
    categories: ['Fashion', 'Design'],
    price: 1500,
    frequency: 'weekly',
  },
  {
    id: 'gma',
    logo: '/logos/gma.png',
    title: 'Great Morning America',
    description: 'GREAT news delivered directly to your inbox.',
    creatorName: 'GMA',
    subscribers: 800000,
    openRate: 23,
    clickRate: 14,
    categories: ['Lifestyle', 'Fun', 'Productivity'],
    price: 25000,
    frequency: 'daily',
  },
  {
    id: 'codementor',
    logo: '/logos/codementor.png',
    title: "Codementor's Newsletter",
    description: '',
    creatorName: 'Codementor',
    subscribers: 671771,
    openRate: 21,
    clickRate: 12,
    categories: ['Tech', 'Productivity'],
    price: 2000,
    frequency: 'weekly',
  },
  {
    id: 'the-brief',
    logo: '/logos/thebrief.png',
    title: 'The Brief',
    description: 'Understand the world more accurately, efficiently and objectively.',
    creatorName: 'The Brief',
    subscribers: 500000,
    openRate: 23,
    clickRate: 0,
    categories: ['Politics'],
    price: 1500,
    frequency: 'daily',
  },
  {
    id: 'skills-to-success',
    logo: '/logos/skills.png',
    title: 'Skills to Success Newsletter',
    description: 'We cover professional and personal development topics for your success',
    creatorName: 'Skills to Success',
    subscribers: 250000,
    openRate: 27,
    clickRate: 1,
    categories: [],
    price: 500,
    frequency: 'weekly',
  },
  {
    id: 'current-tech',
    logo: '/logos/currtech.png',
    title: 'The Current Tech News',
    description: 'The inside scoop on tech news that matters - in just 5 minutes a day. Headlines you need to stay in',
    creatorName: 'The Current Tech News',
    subscribers: 232000,
    openRate: 0,
    clickRate: 0,
    categories: ['Tech', 'Lifestyle'],
    price: 2500,
    frequency: 'daily',
  },
  {
    id: 'church-solutions',
    logo: '/logos/church.png',
    title: 'Church Solutions Company',
    description: 'Product Promotion and Tips for Church Staff',
    creatorName: 'Church Solutions',
    subscribers: 200000,
    openRate: 15,
    clickRate: 1,
    categories: ['Lifestyle'],
    price: 500,
    frequency: 'monthly',
  },
];

export default function SearchPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('default');

  // Get unique categories for filter
  const categories = useMemo(() => {
    const allCategories = new Set<string>();
    NEWSLETTERS.forEach(opp => {
      opp.categories.forEach(cat => allCategories.add(cat));
    });
    return Array.from(allCategories).sort();
  }, []);

  // Filter and sort opportunities
  const filteredOpportunities = useMemo(() => {
    let filtered = [...NEWSLETTERS];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(opp =>
        opp.categories.includes(selectedCategory)
      );
    }

    // Filter by frequency
    if (selectedFrequency !== 'all') {
      filtered = filtered.filter(opp =>
        opp.frequency === selectedFrequency
      );
    }

    // Sort
    if (selectedSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'subscribers-desc') {
      filtered.sort((a, b) => b.subscribers - a.subscribers);
    }

    return filtered;
  }, [selectedCategory, selectedFrequency, selectedSort]);

  return (
    <>
      <Head>
        <title>Search Opportunities - Hecto</title>
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
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Categories Filter */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Categories
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Frequency Filter */}
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  id="frequency"
                  value={selectedFrequency}
                  onChange={(e) => setSelectedFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Frequencies</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort
                </label>
                <select
                  id="sort"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="subscribers-desc">Subscribers: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Opportunity Cards */}
          <div className="space-y-4">
            {filteredOpportunities.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No opportunities found</div>
            ) : (
              filteredOpportunities.map((opportunity) => (
                <a
                  key={opportunity.id}
                  href={`/newsletter/${opportunity.id}`}
                  className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                <div className="flex items-start justify-between">
                  {/* Left: Logo + Content */}
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Logo */}
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {opportunity.title}
                      </h3>

                      {/* Description */}
                      {opportunity.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {opportunity.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span>{opportunity.subscribers.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{opportunity.openRate}%</span>
                        </div>
                        {opportunity.clickRate > 0 && (
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                            <span>{opportunity.clickRate}%</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {opportunity.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {opportunity.categories.map((category) => (
                            <span
                              key={category}
                              className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded border border-blue-200"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Price */}
                  <div className="ml-4 flex-shrink-0 text-right">
                    <div className="text-xl font-bold text-gray-900">
                      ${opportunity.price}
                    </div>
                  </div>
                </div>
              </a>
              ))
            )}
          </div>

          {/* More Results Button */}
          <div className="mt-8 text-center">
            <a
              href="https://app.hecto.io/login"
              className="inline-block bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
            >
              More Results
            </a>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-400">
              © 2025 Hecto Inc. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
