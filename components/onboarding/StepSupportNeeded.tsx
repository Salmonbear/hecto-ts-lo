import { useState } from 'react';
import styles from './OnboardingSteps.module.css';

interface SupportData {
  partnershipTypes: string[];
  context: string;
  targetAudience: string;
  geography: string[];
}

interface StepSupportNeededProps {
  initialData?: Partial<SupportData>;
  onNext: (data: SupportData) => void;
  onBack: () => void;
}

const partnershipOptions = [
  {
    value: 'sponsorship',
    label: 'Sponsorship',
    description: 'Pay for placement — ads, sponsored content, newsletter slots',
  },
  {
    value: 'collaboration',
    label: 'Collaboration',
    description: 'Co-create for mutual benefit — joint content, giveaways, cross-promo',
  },
  {
    value: 'affiliate',
    label: 'Affiliate',
    description: 'Performance-based — commission on sales, referrals, sign-ups',
  },
];

const geographyOptions = [
  { value: 'global', label: 'Global' },
  { value: 'us', label: 'US' },
  { value: 'uk', label: 'UK' },
  { value: 'eu', label: 'EU' },
  { value: 'canada', label: 'Canada' },
  { value: 'australia', label: 'Australia' },
  { value: 'apac', label: 'APAC' },
  { value: 'latam', label: 'LATAM' },
];

export default function StepSupportNeeded({
  initialData,
  onNext,
  onBack,
}: StepSupportNeededProps) {
  const [partnershipTypes, setPartnershipTypes] = useState<string[]>(
    initialData?.partnershipTypes || []
  );
  const [context, setContext] = useState(initialData?.context || '');
  const [targetAudience, setTargetAudience] = useState(
    initialData?.targetAudience || ''
  );
  const [geography, setGeography] = useState<string[]>(
    initialData?.geography || []
  );

  const togglePartnership = (value: string) => {
    setPartnershipTypes((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const toggleGeography = (value: string) => {
    setGeography((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const isValid =
    partnershipTypes.length > 0 &&
    context.trim() &&
    targetAudience.trim() &&
    geography.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext({
        partnershipTypes,
        context,
        targetAudience,
        geography,
      });
    }
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>What support do you need?</h1>
        <p className={styles.stepSubtitle}>
          Tell us what you're looking for and we'll help you find the right partners.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Partnership Types */}
        <div className={styles.field}>
          <label className={styles.label}>
            Partnership type
            <span className={styles.required}>*</span>
          </label>
          <div className={styles.cardOptions}>
            {partnershipOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => togglePartnership(opt.value)}
                className={`${styles.cardOption} ${
                  partnershipTypes.includes(opt.value) ? styles.selected : ''
                }`}
              >
                <span className={styles.cardOptionLabel}>{opt.label}</span>
                <span className={styles.cardOptionDesc}>{opt.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Context */}
        <div className={styles.field}>
          <label htmlFor="context" className={styles.label}>
            Tell us more
            <span className={styles.required}>*</span>
          </label>
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., We're launching a new product in Q2 and want to partner with newsletters in the sustainability space to run a giveaway..."
            rows={4}
            className={styles.textarea}
          />
        </div>

        {/* Target Audience */}
        <div className={styles.field}>
          <label htmlFor="targetAudience" className={styles.label}>
            Target audience
            <span className={styles.required}>*</span>
          </label>
          <textarea
            id="targetAudience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="e.g., Health-conscious millennials interested in sustainable living"
            rows={2}
            className={styles.textarea}
          />
        </div>

        {/* Geography */}
        <div className={styles.field}>
          <label className={styles.label}>
            Geography
            <span className={styles.required}>*</span>
          </label>
          <div className={styles.chipOptions}>
            {geographyOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleGeography(opt.value)}
                className={`${styles.chip} ${
                  geography.includes(opt.value) ? styles.selected : ''
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" onClick={onBack} className={styles.secondaryButton}>
            Back
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={styles.primaryButton}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

