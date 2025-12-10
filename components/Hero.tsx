import { ArrowRight } from 'lucide-react';
import styles from './Hero.module.css';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export default function Hero({
  title = 'Find your next campaign',
  subtitle = 'Connect with brands, pitch your ideas, and grow your business.',
  ctaText = 'Create Campaign',
  onCtaClick,
}: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <button className={styles.cta} onClick={onCtaClick}>
          {ctaText}
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

