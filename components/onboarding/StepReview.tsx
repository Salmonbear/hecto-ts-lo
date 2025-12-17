import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import styles from './OnboardingSteps.module.css';

interface ReviewData {
  title: string;
  summary: string;
}

interface StepReviewProps {
  companyData: {
    category: string;
    anonymizedSummary: string;
    domainRating: number | null;
    reach: number | null;
  };
  supportData: {
    partnershipTypes: string[];
    context: string;
    timeline: string;
    budget: string;
    targetAudience: string;
    categories: string[];
    geography: string[];
  };
  generatedData?: {
    title: string;
    summary: string;
  };
  onLaunch: (data: ReviewData) => void;
  onBack: () => void;
}

const partnershipLabels: Record<string, string> = {
  sponsorship: 'Sponsorship',
  collaboration: 'Collaboration',
  affiliate: 'Affiliate',
};

const timelineLabels: Record<string, string> = {
  asap: 'ASAP',
  this_month: 'This month',
  this_quarter: 'This quarter',
  next_quarter: 'Next quarter',
  no_timeline: 'No specific timeline',
};

const budgetLabels: Record<string, string> = {
  not_applicable: 'Not applicable',
  under_500: '< $500',
  '500_2000': '$500 - $2,000',
  '2000_5000': '$2,000 - $5,000',
  '5000_10000': '$5,000 - $10,000',
  over_10000: '$10,000+',
  open: 'Open to discussion',
};

const categoryLabels: Record<string, string> = {
  saas: 'SaaS / Software',
  fintech: 'Fintech / Crypto',
  ecommerce: 'E-commerce / DTC',
  health: 'Health & Wellness',
  food: 'Food & Beverage',
  fashion: 'Fashion / Beauty',
  sustainability: 'Sustainability / Climate',
  media: 'Media / Publishing',
  creator: 'Creator Economy',
  agency: 'Agency / Services',
  education: 'Education',
  travel: 'Travel / Hospitality',
};

export default function StepReview({
  companyData,
  supportData,
  generatedData,
  onLaunch,
  onBack,
}: StepReviewProps) {
  const [isGenerating, setIsGenerating] = useState(!generatedData);
  const [title, setTitle] = useState(generatedData?.title || '');
  const [summary, setSummary] = useState(generatedData?.summary || '');

  // Simulate AI generation on mount
  useState(() => {
    if (!generatedData) {
      setTimeout(() => {
        setTitle(
          `${categoryLabels[companyData.category] || 'Business'} seeking ${
            supportData.partnershipTypes.map((t) => partnershipLabels[t]).join(' & ')
          } partners`
        );
        setSummary(
          `Looking to connect with aligned partners for ${
            supportData.timeline ? timelineLabels[supportData.timeline] : 'upcoming'
          } initiatives. ${supportData.context.slice(0, 150)}${
            supportData.context.length > 150 ? '...' : ''
          }`
        );
        setIsGenerating(false);
      }, 1500);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLaunch({ title, summary });
  };

  if (isGenerating) {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.loadingState}>
          <Loader2 size={48} className={styles.spinner} />
          <h2 className={styles.loadingTitle}>Creating your listing...</h2>
          <p className={styles.loadingText}>
            We're generating an anonymized version of your opportunity.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>Review & Launch</h1>
        <p className={styles.stepSubtitle}>
          This is how your listing will appear to potential partners.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Preview Card */}
        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <div className={styles.previewCategory}>
              <span className={styles.previewCategoryIcon}>
                {(categoryLabels[companyData.category] || 'O').charAt(0)}
              </span>
              <div>
                <span className={styles.previewCategoryLabel}>
                  {categoryLabels[companyData.category] || 'Other'}
                </span>
                <span className={styles.previewAnon}>Anonymous opportunity</span>
              </div>
            </div>
          </div>

          <div className={styles.previewField}>
            <label className={styles.previewFieldLabel}>
              Title
              <span className={styles.aiTag}>✨ AI-generated</span>
            </label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={2}
              className={styles.previewInput}
            />
          </div>

          <div className={styles.previewField}>
            <label className={styles.previewFieldLabel}>
              Summary
              <span className={styles.aiTag}>✨ AI-generated</span>
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className={styles.previewInput}
            />
          </div>

          <div className={styles.previewDivider} />

          <div className={styles.previewSection}>
            <span className={styles.previewSectionLabel}>Partnership Type</span>
            <div className={styles.previewTags}>
              {supportData.partnershipTypes.map((type) => (
                <span key={type} className={styles.previewTag}>
                  {partnershipLabels[type]}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.previewSection}>
            <span className={styles.previewSectionLabel}>Target Audience</span>
            <p className={styles.previewText}>{supportData.targetAudience}</p>
          </div>

          <div className={styles.previewRow}>
            <div className={styles.previewSection}>
              <span className={styles.previewSectionLabel}>Geography</span>
              <p className={styles.previewText}>
                {supportData.geography.map((g) => g.toUpperCase()).join(', ')}
              </p>
            </div>
            {supportData.timeline && (
              <div className={styles.previewSection}>
                <span className={styles.previewSectionLabel}>Timeline</span>
                <p className={styles.previewText}>
                  {timelineLabels[supportData.timeline]}
                </p>
              </div>
            )}
          </div>

          {supportData.budget && (
            <div className={styles.previewSection}>
              <span className={styles.previewSectionLabel}>Budget</span>
              <p className={styles.previewText}>{budgetLabels[supportData.budget]}</p>
            </div>
          )}

          <div className={styles.previewDivider} />

          <div className={styles.previewMetrics}>
            <div className={styles.previewMetric}>
              <span className={styles.previewMetricLabel}>Your DR</span>
              <span className={styles.previewMetricValue}>
                {companyData.domainRating ?? 'Pending'}
              </span>
            </div>
            <div className={styles.previewMetric}>
              <span className={styles.previewMetricLabel}>Your Reach</span>
              <span className={styles.previewMetricValue}>
                {companyData.reach ? `~${companyData.reach.toLocaleString()}` : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" onClick={onBack} className={styles.secondaryButton}>
            Back
          </button>
          <button type="submit" className={styles.launchButton}>
            Launch
          </button>
        </div>
      </form>
    </div>
  );
}

