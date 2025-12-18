import Head from 'next/head';
import Script from 'next/script';

export default function StitchPage() {
  return (
    <>
      <Head>
        <title>Hecto - Partnership Marketing Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Permanent+Marker&family=Gochi+Hand&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

        <style>{`
          /* Custom styles for that hand-drawn feel */
          .wobbly-box {
            border: 2px solid #1e293b;
            box-shadow: 4px 4px 0px 0px #1e293b;
            transition: all 0.2s ease;
          }
          .wobbly-box:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px 0px #1e293b;
          }
          .rotate-random-1 { transform: rotate(-1deg); }
          .rotate-random-2 { transform: rotate(1.5deg); }
          .rotate-random-3 { transform: rotate(-2deg); }

          .scribble-underline {
            position: relative;
            display: inline-block;
          }
          .scribble-underline::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 100%;
            height: 6px;
            background: url("data:image/svg+xml,%3Csvg width='100' height='10' viewBox='0 0 100 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 5C15 2 20 8 35 5C50 2 55 8 70 5C85 2 90 8 98 5' stroke='%23135bec' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E");
            background-repeat: repeat-x;
            background-size: contain;
          }
        `}</style>
      </Head>

      {/* Tailwind */}
      <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
      <Script
        id="tailwind-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              darkMode: "class",
              theme: {
                extend: {
                  colors: {
                    "primary": "#135bec",
                    "background-light": "#FDFBF7",
                    "background-dark": "#101622",
                    "earth-sage": "#D8E6D6",
                    "earth-clay": "#F2D5C4",
                    "earth-mustard": "#F5EBC3",
                    "ink": "#1e293b",
                  },
                  fontFamily: {
                    "display": ["Manrope", "sans-serif"],
                    "handwritten": ["Permanent Marker", "cursive"],
                    "doodle": ["Gochi Hand", "cursive"],
                  },
                  borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px"},
                  boxShadow: {
                    'wobbly': '3px 3px 0px 0px #1e293b',
                    'wobbly-primary': '4px 4px 0px 0px #135bec',
                  }
                },
              },
            }
          `,
        }}
      />

      <div className="font-display bg-background-light dark:bg-background-dark text-ink antialiased overflow-x-hidden">
        {/* Top Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b-2 border-ink/10 bg-background-light/95 backdrop-blur-sm dark:bg-background-dark/95">
          <div className="px-6 md:px-12 lg:px-20 py-4 max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="relative size-10">
                <svg className="w-full h-full text-primary fill-current" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20,50 Q30,20 50,20 T80,50 T50,80 T20,50" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="8"></path>
                  <circle cx="50" cy="50" r="10"></circle>
                </svg>
              </div>
              <h1 className="font-handwritten text-2xl md:text-3xl text-ink tracking-wide transform -rotate-2">Hecto</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a className="text-sm font-bold hover:text-primary transition-colors" href="#">Browse Opportunities</a>
              <a className="text-sm font-bold hover:text-primary transition-colors" href="#">Success Stories</a>
              <a className="text-sm font-bold hover:text-primary transition-colors" href="#">Pricing</a>
            </div>

            <div className="flex items-center gap-4">
              <a className="hidden sm:block text-sm font-bold hover:text-primary transition-colors" href="#">Login</a>
              <button className="bg-primary text-white text-sm font-bold py-2.5 px-6 rounded-lg shadow-wobbly-primary hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#135bec] transition-all border-2 border-ink">
                Find a Partner
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 px-6 overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-20 left-10 opacity-20 text-primary animate-pulse">
            <svg fill="none" height="60" stroke="currentColor" strokeWidth="4" viewBox="0 0 100 100" width="60">
              <path d="M10,50 Q30,20 50,50 T90,50"></path>
            </svg>
          </div>
          <div className="absolute bottom-10 right-10 opacity-20 text-earth-mustard hidden md:block">
            <svg fill="currentColor" height="120" viewBox="0 0 100 100" width="120">
              <circle cx="50" cy="50" r="40"></circle>
            </svg>
          </div>

          <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8 text-center lg:text-left z-10">
              <div className="inline-block mx-auto lg:mx-0 bg-earth-mustard px-4 py-1 rounded-full border-2 border-ink rotate-random-2 w-fit">
                <span className="font-doodle font-bold text-ink">👋 Say goodbye to cold emails!</span>
              </div>

              <h1 className="font-handwritten text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-ink">
                Stop Cold Calling. <br/>
                <span className="text-primary scribbles relative inline-block">
                  Start Collaborating.
                  <svg className="absolute -bottom-2 left-0 w-full h-4 text-earth-clay -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
                  </svg>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-ink/80 font-medium max-w-lg mx-auto lg:mx-0">
                Hecto connects humans behind brands for newsletters, giveaways, and co-marketing partnerships in a fun, friendly way.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-primary text-white text-lg font-bold py-4 px-8 rounded-xl border-2 border-ink shadow-wobbly-primary hover:-translate-y-1 transition-transform">
                  Find a Partner
                </button>
                <button className="bg-white text-ink text-lg font-bold py-4 px-8 rounded-xl border-2 border-ink shadow-wobbly hover:-translate-y-1 transition-transform">
                  How it works
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm font-bold text-ink/60 mt-2">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                <span>100% human verified</span>
              </div>
            </div>

            {/* Hero Image Collage */}
            <div className="relative hidden lg:block h-[500px]">
              {/* Card 1 */}
              <div className="absolute top-10 left-10 w-64 bg-white p-4 rounded-lg border-2 border-ink shadow-wobbly rotate-random-3 z-20">
                <div className="h-32 bg-earth-sage rounded mb-3 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCeb8ElqqV_GRz2lDW1TpPJbw4jEsGJqBPGRD8_a388Fylaw4xl8k0dhB7JvG2Vwl4dpCV-RWsN9jJJrm7lv9DtJ8v2LpuhjMFtnFrtKsAWISAyseXmJGDyGg9_RchR8gPagd0pQ3sBeV9nOq0xyzZmDACLDv3v-w9sphcHh31ryKl2LbohoKO5zvVl4AvTPok69xKD2irK--dpNGpK-PLHwvZAY3XTKg6lnaa44P95GuZ42TI0pthhfqDV0iH1vrlydkAIDkJWvhk')"}}></div>
                <div className="font-bold text-lg mb-1">Newsletter Swap</div>
                <div className="text-sm text-gray-600">Looking for 5k+ subs in Tech</div>
              </div>

              {/* Card 2 */}
              <div className="absolute top-40 right-10 w-64 bg-white p-4 rounded-lg border-2 border-ink shadow-wobbly rotate-random-2 z-10">
                <div className="h-32 bg-earth-clay rounded mb-3 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwj69VocGMB1LB3dAZkOD5TIOvbzFqSntOs8Cn1VBsyAzq4p9euNWrtQKSEHdWmlnYSq3m2udOeBEIpKMAe8kNPWcoDvMmIS6ZtgJ9WX6c3Bd7VVS7Ld16DBNvsMMtDj0upUedM7N-DsZrxEKK4rB-aJ69yM70hXGW40fhr4XCo33z9i_37HBzDCj8-JE0323Abpqp-ZMiO2tiuN0R4rzE1lHHyQ34FysC0UH-5_x0PbKU7J-6mbgCXJzULl7LaUfoeVxqSAa5Pto')"}}></div>
                <div className="font-bold text-lg mb-1">Podcast Guest</div>
                <div className="text-sm text-gray-600">SaaS Founder wanted!</div>
              </div>

              {/* Decorative elements */}
              <svg className="absolute bottom-20 left-20 w-24 h-24 text-primary animate-bounce" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 100 100">
                <path d="M50,10 L50,90 M10,50 L90,50 M20,20 L80,80 M20,80 L80,20"></path>
              </svg>
            </div>
          </div>
        </header>

        {/* Logo Cloud */}
        <section className="py-12 bg-earth-clay/30 border-y-2 border-ink/5">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <p className="font-doodle text-2xl text-ink mb-8 rotate-random-1">Trusted by friendly folks at...</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-80 grayscale mix-blend-multiply">
              <div className="font-display font-black text-2xl tracking-tighter">ACME Co.</div>
              <div className="font-display font-black text-2xl tracking-tighter">Globex</div>
              <div className="font-display font-black text-2xl tracking-tighter">Soylent Corp</div>
              <div className="font-display font-black text-2xl tracking-tighter">Initech</div>
              <div className="font-display font-black text-2xl tracking-tighter">Umbrella</div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-handwritten text-4xl md:text-5xl mb-4 text-ink">How it works</h2>
              <p className="text-lg text-ink/70 font-doodle rotate-random-1">Three simple steps to your next big partnership.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-2xl border-2 border-ink shadow-wobbly flex flex-col items-center text-center rotate-random-1 hover:rotate-0 transition-transform">
                <div className="w-16 h-16 bg-earth-sage rounded-full flex items-center justify-center border-2 border-ink mb-6 text-ink">
                  <span className="material-symbols-outlined text-3xl">edit_note</span>
                </div>
                <h3 className="font-bold text-xl mb-2">1. Post an offer</h3>
                <p className="text-ink/70">Share what you have and what you want. It&apos;s like a dating profile, but for business.</p>
              </div>

              {/* Arrow 1 (Desktop only) */}
              <div className="hidden md:block absolute top-1/2 left-[28%] w-24 -translate-y-1/2 z-0">
                <svg fill="none" stroke="#135bec" strokeDasharray="5 5" strokeWidth="3" viewBox="0 0 100 30">
                  <path d="M0,15 Q50,0 100,15"></path>
                  <path d="M90,10 L100,15 L90,20"></path>
                </svg>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-8 rounded-2xl border-2 border-ink shadow-wobbly flex flex-col items-center text-center -rotate-random-2 hover:rotate-0 transition-transform z-10">
                <div className="w-16 h-16 bg-earth-mustard rounded-full flex items-center justify-center border-2 border-ink mb-6 text-ink">
                  <span className="material-symbols-outlined text-3xl">handshake</span>
                </div>
                <h3 className="font-bold text-xl mb-2">2. Get Matched</h3>
                <p className="text-ink/70">Our algorithm finds brands that align with your values and audience size.</p>
              </div>

              {/* Arrow 2 (Desktop only) */}
              <div className="hidden md:block absolute top-1/2 right-[28%] w-24 -translate-y-1/2 z-0">
                <svg fill="none" stroke="#135bec" strokeDasharray="5 5" strokeWidth="3" viewBox="0 0 100 30">
                  <path d="M0,15 Q50,30 100,15"></path>
                  <path d="M90,10 L100,15 L90,20"></path>
                </svg>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-8 rounded-2xl border-2 border-ink shadow-wobbly flex flex-col items-center text-center rotate-random-2 hover:rotate-0 transition-transform">
                <div className="w-16 h-16 bg-earth-clay rounded-full flex items-center justify-center border-2 border-ink mb-6 text-ink">
                  <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                </div>
                <h3 className="font-bold text-xl mb-2">3. Launch Campaign</h3>
                <p className="text-ink/70">Collaborate, launch your co-marketing campaign, and watch your reach explode.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Opportunities Grid */}
        <section className="py-24 px-6 bg-earth-sage/30 border-y-2 border-ink/10">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="font-handwritten text-4xl mb-2 text-ink">Fresh Opportunities</h2>
                <p className="font-doodle text-xl text-ink/70">Hot off the press! Grab them while you can.</p>
              </div>
              <a className="text-primary font-bold hover:underline flex items-center gap-1 group" href="#">
                View all opportunities
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Opportunity Card 1 */}
              <div className="bg-white p-5 rounded-xl border-2 border-ink shadow-wobbly hover:-translate-y-1 transition-transform flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 bg-cover bg-center border border-ink" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCW3IJSbxefUhX7PESAPsupD_hzxJY3pBVH5ALTb7aCq2fM0E0VYev2nVvFvnIcgHntgj24OlC9p5w47Iu1CIKon_Bf64rvAv8WqLLMuke1AAY2QoF5Vc81KIqBlIuelPxvjxYHKvgFaZuvmRCM61a_ARMWKKUpxmhGgAexH7DDDTa0JZZahQ3sPeNIG-lejm12ju0gwuW9upVVTMPkZ0fnYsM7EUKQI7PJBkDf4mK558HQkz1a-QgibtYqvHO9YlGluDT_szMCkHM')"}}></div>
                  <div>
                    <div className="font-bold text-sm">Sarah&apos;s Soaps</div>
                    <div className="text-xs text-gray-500">Beauty &amp; Wellness</div>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 leading-tight">Seeking organic skincare brands for holiday bundle</h3>
                <div className="mt-auto pt-4 flex gap-2">
                  <span className="bg-earth-sage px-2 py-1 rounded border border-ink text-xs font-bold">Bundle</span>
                  <span className="bg-earth-mustard px-2 py-1 rounded border border-ink text-xs font-bold">5k Reach</span>
                </div>
              </div>

              {/* Opportunity Card 2 */}
              <div className="bg-white p-5 rounded-xl border-2 border-ink shadow-wobbly hover:-translate-y-1 transition-transform flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 bg-cover bg-center border border-ink" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0LTo-Y2yudyov0pYBhZoHMj-IcIea4L1NutK6rsVU8q8UC9wSrxSLaO6bv5xFvxxaVH4paIzRHklg8b0Wz2P74iLloaYzMtko0vVJlk2x-uRQh4FQc22WEHGvFtxLIQc1odflknzHPcdCm9yU1_-L4WJ8jK08byDBLLdz3qn5QOky3fBS04vs7FFJ6h2msMuFzUywhKe7QjiD6f6CNxQ6UZ3pswj4s4yoHyimD1ov_gqMaOKKQ-Rb7PRIhssAFUUZPoYrg6Ktz58')"}}></div>
                  <div>
                    <div className="font-bold text-sm">TechDaily</div>
                    <div className="text-xs text-gray-500">SaaS &amp; B2B</div>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 leading-tight">Looking for SaaS founders to interview on podcast</h3>
                <div className="mt-auto pt-4 flex gap-2">
                  <span className="bg-earth-clay px-2 py-1 rounded border border-ink text-xs font-bold">Podcast</span>
                  <span className="bg-earth-sage px-2 py-1 rounded border border-ink text-xs font-bold">12k Reach</span>
                </div>
              </div>

              {/* Opportunity Card 3 */}
              <div className="bg-white p-5 rounded-xl border-2 border-ink shadow-wobbly hover:-translate-y-1 transition-transform flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 bg-cover bg-center border border-ink" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHVX_jUMbLQ-wrAA0tnTc9uRBAfwYe828q079rGJaVjYPRB_qjcjhgQhleoFDWd--y1xKJZPyCVPp6zFRjf9lXHSjqehuODK68_yEB2tnDLMXLeVspZR77jqPGk_wi68HlnA4dH04nl-64AKH9ZLenkQ57J5Q4ijiDTZPZFOxVPzdawEFygZXA_mv0Wk_lSvsTt9v7-xOYmexXoNGIcUMct_4YbRERP43KpbesMRaaj9W9NhZBmP29UWJ4fiFUF8IhssLFE4P_2is')"}}></div>
                  <div>
                    <div className="font-bold text-sm">Yoga with Em</div>
                    <div className="text-xs text-gray-500">Health &amp; Fitness</div>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 leading-tight">Newsletter swap for January health kick</h3>
                <div className="mt-auto pt-4 flex gap-2">
                  <span className="bg-earth-mustard px-2 py-1 rounded border border-ink text-xs font-bold">Newsletter</span>
                  <span className="bg-earth-clay px-2 py-1 rounded border border-ink text-xs font-bold">8k Reach</span>
                </div>
              </div>

              {/* Opportunity Card 4 */}
              <div className="bg-background-light p-5 rounded-xl border-2 border-dashed border-ink/30 flex flex-col h-full justify-center items-center text-center group cursor-pointer hover:border-primary hover:text-primary transition-colors">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-2xl">add</span>
                </div>
                <h3 className="font-bold text-lg">Post your own opportunity</h3>
                <p className="text-sm mt-1 opacity-70">It&apos;s free to start!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-24 px-6">
          <div className="max-w-[1000px] mx-auto">
            <div className="bg-earth-mustard rounded-3xl p-8 md:p-12 border-2 border-ink shadow-[8px_8px_0px_0px_#1e293b] relative">
              {/* Quote Icon */}
              <div className="absolute -top-6 -left-4 bg-primary text-white p-3 rounded-lg border-2 border-ink shadow-wobbly rotate-random-3">
                <span className="material-symbols-outlined text-4xl">format_quote</span>
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="shrink-0 relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-white p-2 rounded-full border-2 border-ink shadow-wobbly rotate-random-2">
                    <img className="w-full h-full object-cover rounded-full border border-ink/10" alt="Happy business woman smiling" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHO4Y5pNWTOcx-O4DnanfYRITO0dSsbAIhFUJzKcXloKsWVMxtf8sDIHvlAM_BDi_VDc5VfrGiz8p6s26HjJhhwVWLeERhRCmRSQkw1uAAHncrusmqoAfTJQ3sLSwXdTpM0jdLwBsIbKLiqY0nUmEQecnAkbL4ln_cbO3XFItPMcUlhubkgzK0pugN-CgPLEKqgOqvdPWdlWAk5XJ7gAdmKIQKfJ4S-Sb_zmznPE0StT4eyEIim3i8igAjlNK1F2wA3Xtr3srXjS0" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1 rounded-full border-2 border-ink text-xs font-bold shadow-sm -rotate-3">
                    Marketing Lead
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <p className="text-xl md:text-2xl font-medium leading-relaxed mb-6 font-display">
                    &quot;Hecto is the most human B2B platform I&apos;ve ever used. We found three perfect newsletter partners in a week, and the process felt like chatting with friends, not negotiating contracts.&quot;
                  </p>
                  <div>
                    <div className="font-bold text-lg font-handwritten tracking-wide">Jessica Chen</div>
                    <div className="text-sm text-ink/70 font-bold uppercase tracking-wider">Growth at Loomy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 relative bg-primary/5">
          <div className="max-w-[800px] mx-auto text-center">
            <div className="inline-block mb-6 rotate-random-1">
              <span className="bg-earth-clay text-ink px-4 py-2 rounded-lg border-2 border-ink font-doodle font-bold text-lg shadow-sm">
                ✨ It&apos;s time to grow together
              </span>
            </div>

            <h2 className="font-handwritten text-5xl md:text-6xl mb-6 text-ink">Find your perfect match</h2>
            <p className="text-xl text-ink/70 mb-10 font-medium">Search through thousands of active collaboration opportunities waiting for a brand just like yours.</p>

            {/* Search Bar */}
            <div className="relative max-w-[500px] mx-auto group">
              <div className="absolute inset-0 bg-ink rounded-xl translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3"></div>
              <div className="relative bg-white border-2 border-ink rounded-xl flex items-center p-2">
                <span className="material-symbols-outlined ml-3 text-gray-400">search</span>
                <input className="w-full border-none focus:ring-0 text-lg placeholder:text-gray-400 font-medium text-ink bg-transparent" placeholder="Search for cool brands..." type="text" />
                <button className="bg-primary text-white font-bold py-3 px-6 rounded-lg border-2 border-primary hover:bg-primary/90 transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* Footer Doodle */}
            <div className="mt-16 flex justify-center opacity-60">
              <svg fill="none" height="40" viewBox="0 0 200 40" width="200" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20C40 10 60 30 90 20C120 10 140 30 170 20" stroke="#135bec" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                <path d="M160 15L170 20L160 25" stroke="#135bec" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
              </svg>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background-dark text-white pt-20 pb-10 px-6 border-t-4 border-primary">
          <div className="max-w-[1200px] mx-auto grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="font-handwritten text-4xl">Hecto</h2>
              </div>
              <p className="text-gray-400 max-w-sm text-lg">
                The partnership platform that puts humans first. Built with ❤️ and ☕️ for brands that care.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-earth-mustard font-doodle tracking-widest">Platform</h3>
              <ul className="space-y-3">
                <li><a className="text-gray-400 hover:text-white transition-colors" href="#">Browse Offers</a></li>
                <li><a className="text-gray-400 hover:text-white transition-colors" href="#">Post an Offer</a></li>
                <li><a className="text-gray-400 hover:text-white transition-colors" href="#">Success Stories</a></li>
                <li><a className="text-gray-400 hover:text-white transition-colors" href="#">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-earth-sage font-doodle tracking-widest">Company</h3>
              <ul className="space-y-3">
                <li><a className="text-gray-400 hover:text-white transition-colors" href="#">About Us</a></li>
                <li><a className="text-gray-400 hover:text-white transition-colors" href="#">Careers</a></li>
                <li><a className="text-gray-400 hover:text-white transition-colors" href="#">Blog</a></li>
                <li><a className="text-gray-400 hover:text-white transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-handwritten text-2xl text-gray-500">Let&apos;s grow together</div>
            <div className="text-gray-500 text-sm">© 2023 Hecto Inc. All rights reserved.</div>
            <div className="flex gap-4">
              <a className="text-gray-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
              <a className="text-gray-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
