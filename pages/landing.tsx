import { useRouter } from 'next/router';
import styles from '../styles/Landing.module.css';

export default function LandingPage() {
  const router = useRouter();

  const partners = [
    'Hootsuite',
    'Bubble',
    'EmailOctopus',
    'Monday.com',
    'User.com',
  ];

  const features = [
    {
      icon: '🤝',
      title: 'Curated Partnerships',
      description: "Quality over quantity. We curate for aligned partnerships that actually make sense.",
    },
    {
      icon: '🚀',
      title: 'Launch-Focused',
      description: 'Built specifically for product launches. Everyone here wants to help or be helped.',
    },
    {
      icon: '💬',
      title: 'Direct Connection',
      description: "No middlemen. Connect directly with founders and audience owners who want to work together.",
    },
    {
      icon: '🎁',
      title: 'Flexible Deals',
      description: "Email swaps, bundles, shoutouts, rev-share, paid placements — you choose what works.",
    },
    {
      icon: '✨',
      title: 'Fresh Opportunities',
      description: "New launches posted daily. Be the first to discover products your audience will love.",
    },
    {
      icon: '🔒',
      title: 'Trusted Community',
      description: "Safe, private, and founder-friendly. No spam, no cold pitches, just warm partnerships.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.navLeft}>
            <a href="#products">PRODUCTS</a>
            <a href="#pricing">PRICING</a>
            <a href="#blog">BLOG</a>
          </div>

          <div className={styles.logo}>hecto.</div>

          <div className={styles.navRight}>
            <button
              className={styles.startButton}
              onClick={() => router.push('/login')}
            >
              START FOR FREE
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Find warm, trusted partners<br />
            to supercharge your next product launch
          </h1>

          <p className={styles.heroSubtitle}>
            Without cold DMs or paid ads. Connect with audience owners, creators, and founders<br />
            who want to help launch your product — and grow together.
          </p>

          <div className={styles.dualCta}>
            <button className={styles.ctaLaunch} onClick={() => router.push('/login')}>
              I'm Launching Something
            </button>
            <button className={styles.ctaAudience} onClick={() => router.push('/login')}>
              I Have an Audience
            </button>
          </div>

          {/* Social Proof */}
          <div className={styles.socialProof}>
            <p className={styles.socialProofLabel}>TRUSTED BY FOUNDERS AT</p>
            <div className={styles.partnerLogos}>
              {partners.map((partner) => (
                <div key={partner} className={styles.partnerLogo}>
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Two-Sided Value Props */}
      <section className={styles.valueSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter}>
            Why founders and audience owners <span className={styles.highlight}>love Hecto</span>
          </h2>

          <div className={styles.twoSidedGrid}>
            {/* For Founders */}
            <div className={styles.sideCard}>
              <div className={styles.sideLabel}>For Founders Launching</div>
              <h3 className={styles.sideTitle}>Get warm audience access without the grind</h3>
              <ul className={styles.benefitsList}>
                <li>Immediate access to launch partners</li>
                <li>Save days on cold outreach</li>
                <li>Reduce customer acquisition cost</li>
                <li>Get exposure without ad spend</li>
                <li>Find aligned partners who actually care</li>
              </ul>
            </div>

            {/* For Audience Owners */}
            <div className={styles.sideCard}>
              <div className={styles.sideLabel}>For Audience Owners</div>
              <h3 className={styles.sideTitle}>Fresh products to share, new revenue streams</h3>
              <ul className={styles.benefitsList}>
                <li>Curated dealflow of quality products</li>
                <li>Optional rev-share or paid partnerships</li>
                <li>Give your audience exclusive access</li>
                <li>Build social capital with founders</li>
                <li>Grow through reciprocal promotion</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className={styles.campaignSection}>
        <div className={styles.container}>
          <div className={styles.howItWorks}>
            <h2 className={styles.sectionTitleCenter}>
              How it works
            </h2>

            <div className={styles.stepsGrid}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>01</div>
                <h3 className={styles.stepTitle}>Post your launch or offer</h3>
                <p className={styles.stepDescription}>Founders post what they're launching. Audience owners offer their platform.</p>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>02</div>
                <h3 className={styles.stepTitle}>Browse the board</h3>
                <p className={styles.stepDescription}>Find aligned partners in our curated marketplace. No algorithms, no noise.</p>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>03</div>
                <h3 className={styles.stepTitle}>Connect directly</h3>
                <p className={styles.stepDescription}>Start conversations. Agree on terms. Launch together and grow together.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.featuresSectionTitle}>
            Why Hecto is <span className={styles.highlight}>different</span>
          </h2>

          <div className={styles.featuresGrid}>
            {features.map((feature) => (
              <div key={feature.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2 className={styles.finalCtaTitle}>Ready to find your launch partners?</h2>
          <p className={styles.finalCtaSubtitle}>Join founders and audience owners who are making product launches happen together</p>
          <div className={styles.dualCta}>
            <button className={styles.ctaLaunch} onClick={() => router.push('/login')}>
              I'm Launching Something
            </button>
            <button className={styles.ctaAudience} onClick={() => router.push('/login')}>
              I Have an Audience
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerCopyright}>© Hecto. All rights reserved</div>
          <div className={styles.footerLinks}>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms and Conditions</a>
            <a href="#contact">Contact Us</a>
            <a href="#brand">Brand</a>
            <a href="#collabs">Collabs</a>
            <a href="#resources">Resources</a>
            <a href="#wsp">WSP</a>
            <a href="#ep">EP</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
