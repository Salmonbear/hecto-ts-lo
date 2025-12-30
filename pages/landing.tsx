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
      icon: '🎯',
      title: 'Audience Overlap Analysis',
      description: "See exactly how much your ICP overlaps with each partner's audience before you reach out.",
    },
    {
      icon: '✓',
      title: 'Verified Partners',
      description: 'Every creator, newsletter, and brand is verified. Real metrics, real contacts, real deals.',
    },
    {
      icon: '🤖',
      title: 'AI-Drafted Outreach',
      description: "Context-aware pitch templates that reference the partner's content and audience. Close deals faster.",
    },
    {
      icon: '📊',
      title: 'Performance Tracking',
      description: "Track your distribution deals like any other growth channel. See what's working, double down.",
    },
    {
      icon: '💼',
      title: 'Warm Introductions',
      description: "Access partners who are actively looking for collaboration. No cold outreach needed.",
    },
    {
      icon: '⚡',
      title: 'Fast Deal Flow',
      description: "From search to signed deal in days, not weeks. Built for teams that move fast.",
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
            <a href="#demo" className={styles.watchDemo}>WATCH DEMO</a>
            <button
              className={styles.startButton}
              onClick={() => router.push('/app')}
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
          The partership platform for  launch partners who already reach your customers<br />
          Free. Private. No big tech algorithms.
          </h1>

          <p className={styles.heroSubtitle}>
          Hecto replaces cold outreach and random guessing with a structured, data-driven way<br />
          to find partners who already reach your target audience.
          </p>

          {/* Social Proof */}
          <div className={styles.socialProof}>
            <p className={styles.socialProofLabel}>TRUSTED BY GROWTH TEAMS AT</p>
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

      {/* Value Props */}
      <section className={styles.valueSection}>
        <div className={styles.container}>
          <div className={styles.valueProp}>
            <div className={styles.valuePropContent}>
              <h2 className={styles.sectionTitle}>
                Don't fight algorithms.<br />
                Partner with people who<br />
                <span className={styles.highlight}>already own your audience.</span>
              </h2>
            </div>

            <div className={styles.testimonial}>
              <div className={styles.testimonialCard}>
                <div className={styles.testimonialHeader}>
                  <div className={styles.testimonialAvatar}>AR</div>
                  <div>
                    <div className={styles.testimonialName}>Austin Rief</div>
                    <div className={styles.testimonialHandle}>Morning Brew</div>
                  </div>
                  <div className={styles.twitterIcon}>𝕏</div>
                </div>
                <div className={styles.testimonialText}>
                  <p>10/ The next insight we had was buying ads in other newsletters.</p>
                  <p>We realized that there were many under-monetized newsletters and we began to buy ads in those newsletters.</p>
                  <p>To this day, those subscribers were the best quality subscribers we've acquired.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className={styles.campaignSection}>
        <div className={styles.container}>
          <div className={styles.howItWorks}>
            <h2 className={styles.sectionTitleCenter}>
              Your Go-To-Market partner search engine
            </h2>

            <div className={styles.stepsGrid}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>01</div>
                <h3 className={styles.stepTitle}>Describe your audience</h3>
                <p className={styles.stepDescription}>Tell us who you're trying to reach. Industry, demographics, interests.</p>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>02</div>
                <h3 className={styles.stepTitle}>Get verified partners</h3>
                <p className={styles.stepDescription}>Instantly see creators, newsletters, and brands that align with your ICP.</p>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>03</div>
                <h3 className={styles.stepTitle}>Start deals that convert</h3>
                <p className={styles.stepDescription}>AI-drafted outreach with contact context. Close distribution deals faster.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.featuresSectionTitle}>
            Built for <span className={styles.highlight}>growth teams</span> who think in channels
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
          <h2 className={styles.finalCtaTitle}>Ready to unlock a new growth channel?</h2>
          <p className={styles.finalCtaSubtitle}>Join growth teams using Hecto to find distribution partners that actually convert</p>
          <button
            className={styles.ctaPrimary}
            onClick={() => router.push('/app')}
          >
            Start Finding Partners
          </button>
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
