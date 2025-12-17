import { useState } from 'react';
import { Globe, Linkedin, Twitter, Instagram, Mail, Loader2, Check, X, Pencil } from 'lucide-react';
import styles from './OnboardingSteps.module.css';

interface BusinessData {
  websiteUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  newsletterUrl: string;
  companyName: string;
  oneLiner: string;
  category: string;
  anonymizedSummary: string;
  domainRating: number | null;
  reach: number | null;
}

interface StepYourBusinessProps {
  initialData?: Partial<BusinessData>;
  onNext: (data: BusinessData) => void;
  onBack: () => void;
}

interface AISuggestion {
  field: string;
  label: string;
  value: string;
  accepted: boolean | null; // null = pending, true = accepted, false = rejected
  isEditing?: boolean;
  editValue?: string;
}

// Mock AI data for specific domains
const mockAIData: Record<string, {
  companyName: string;
  oneLiner: string;
  category: string;
  categoryLabel: string;
  anonymizedSummary: string;
  domainRating: number;
  reach: number;
  suggestedCategories: string[];
}> = {
  'jenni.ai': {
    companyName: 'Jenni AI',
    oneLiner: 'AI writing assistant that helps you write faster and better',
    category: 'saas',
    categoryLabel: 'SaaS / Software',
    anonymizedSummary: 'An AI-powered writing platform helping students and professionals create better content faster through intelligent assistance.',
    domainRating: 52,
    reach: 450000,
    suggestedCategories: ['SaaS / Software', 'Education', 'Creator Economy'],
  },
  'partnerstack.com': {
    companyName: 'PartnerStack',
    oneLiner: 'The partnerships platform for B2B SaaS',
    category: 'saas',
    categoryLabel: 'SaaS / Software',
    anonymizedSummary: 'A B2B partnerships platform enabling software companies to build and scale their partner ecosystem through affiliates, referrals, and resellers.',
    domainRating: 71,
    reach: 180000,
    suggestedCategories: ['SaaS / Software', 'Agency / Services'],
  },
};

const categoryOptions = [
  { value: 'saas', label: 'SaaS / Software' },
  { value: 'fintech', label: 'Fintech / Crypto' },
  { value: 'ecommerce', label: 'E-commerce / DTC' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'fashion', label: 'Fashion / Beauty' },
  { value: 'sustainability', label: 'Sustainability / Climate' },
  { value: 'media', label: 'Media / Publishing' },
  { value: 'creator', label: 'Creator Economy' },
  { value: 'agency', label: 'Agency / Services' },
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel / Hospitality' },
  { value: 'other', label: 'Other' },
];

export default function StepYourBusiness({
  initialData,
  onNext,
  onBack,
}: StepYourBusinessProps) {
  const [phase, setPhase] = useState<'input' | 'loading' | 'review'>(
    initialData?.companyName ? 'review' : 'input'
  );

  // Input phase
  const [websiteUrl, setWebsiteUrl] = useState(initialData?.websiteUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedinUrl || '');
  const [twitterUrl, setTwitterUrl] = useState(initialData?.twitterUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(initialData?.instagramUrl || '');
  const [newsletterUrl, setNewsletterUrl] = useState(initialData?.newsletterUrl || '');

  // Review phase - suggestions
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [categoryOptions_, setCategoryOptions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [domainRating, setDomainRating] = useState<number | null>(null);
  const [reach, setReach] = useState<number | null>(null);

  const isInputValid = websiteUrl.trim().length > 0;

  const extractDomain = (url: string): string => {
    try {
      const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      return hostname.replace('www.', '');
    } catch {
      return url.toLowerCase().replace('www.', '');
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInputValid) return;

    setPhase('loading');

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const domain = extractDomain(websiteUrl);
    const aiData = mockAIData[domain];

    if (aiData) {
      // Use mock data for known domains
      setSuggestions([
        { field: 'companyName', label: 'Company Name', value: aiData.companyName, accepted: null },
        { field: 'oneLiner', label: 'One-liner', value: aiData.oneLiner, accepted: null },
        { field: 'anonymizedSummary', label: 'Public Summary', value: aiData.anonymizedSummary, accepted: null },
      ]);
      setCategoryOptions(aiData.suggestedCategories);
      setDomainRating(aiData.domainRating);
      setReach(aiData.reach);
    } else {
      // Generic fallback
      setSuggestions([
        { field: 'companyName', label: 'Company Name', value: 'Your Company', accepted: null },
        { field: 'oneLiner', label: 'One-liner', value: 'A brief description of what you do', accepted: null },
        { field: 'anonymizedSummary', label: 'Public Summary', value: 'A company providing innovative solutions in their industry.', accepted: null },
      ]);
      setCategoryOptions(['SaaS / Software', 'E-commerce / DTC', 'Agency / Services']);
      setDomainRating(35);
      setReach(50000);
    }

    setPhase('review');
  };

  const handleAccept = (index: number) => {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, accepted: true, isEditing: false } : s))
    );
  };

  const handleReject = (index: number) => {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, accepted: false, isEditing: true, editValue: s.value } : s))
    );
  };

  const handleEdit = (index: number) => {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, isEditing: true, editValue: s.value } : s))
    );
  };

  const handleEditChange = (index: number, value: string) => {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, editValue: value } : s))
    );
  };

  const handleEditSave = (index: number) => {
    setSuggestions((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, value: s.editValue || s.value, accepted: true, isEditing: false } : s
      )
    );
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
  };

  const allAccepted = suggestions.every((s) => s.accepted === true) && selectedCategory;

  const handleSubmit = () => {
    const getValue = (field: string) => suggestions.find((s) => s.field === field)?.value || '';
    const categoryValue = categoryOptions.find((c) => c.label === selectedCategory)?.value || 'other';

    onNext({
      websiteUrl,
      linkedinUrl,
      twitterUrl,
      instagramUrl,
      newsletterUrl,
      companyName: getValue('companyName'),
      oneLiner: getValue('oneLiner'),
      category: categoryValue,
      anonymizedSummary: getValue('anonymizedSummary'),
      domainRating,
      reach,
    });
  };

  // Input Phase
  if (phase === 'input') {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
          <h1 className={styles.stepTitle}>Tell us about your business</h1>
          <p className={styles.stepSubtitle}>
            We'll analyze your online presence to create your profile.
          </p>
        </div>

        <form onSubmit={handleAnalyze} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="website" className={styles.label}>
              <Globe size={16} />
              Website URL
              <span className={styles.required}>*</span>
            </label>
            <input
              id="website"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourcompany.com"
              className={styles.input}
              autoFocus
            />
            <span className={styles.fieldHint}>Try: jenni.ai or partnerstack.com</span>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label htmlFor="linkedin" className={styles.label}>
                <Linkedin size={16} />
                LinkedIn
              </label>
              <input
                id="linkedin"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="linkedin.com/company/..."
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="twitter" className={styles.label}>
                <Twitter size={16} />
                Twitter / X
              </label>
              <input
                id="twitter"
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="x.com/..."
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label htmlFor="instagram" className={styles.label}>
                <Instagram size={16} />
                Instagram
              </label>
              <input
                id="instagram"
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="instagram.com/..."
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="newsletter" className={styles.label}>
                <Mail size={16} />
                Newsletter
              </label>
              <input
                id="newsletter"
                type="url"
                value={newsletterUrl}
                onChange={(e) => setNewsletterUrl(e.target.value)}
                placeholder="Optional"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onBack} className={styles.secondaryButton}>
              Back
            </button>
            <button
              type="submit"
              disabled={!isInputValid}
              className={styles.primaryButton}
            >
              Analyze
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Loading Phase
  if (phase === 'loading') {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.loadingState}>
          <Loader2 size={48} className={styles.spinner} />
          <h2 className={styles.loadingTitle}>Analyzing your business...</h2>
          <p className={styles.loadingText}>
            We're gathering information from your website and social profiles.
          </p>
        </div>
      </div>
    );
  }

  // Review Phase - Pills UI
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>We found this about you</h1>
        <p className={styles.stepSubtitle}>
          Accept what looks right, edit what doesn't.
        </p>
      </div>

      <div className={styles.suggestionsContainer}>
        {suggestions.map((suggestion, index) => (
          <div key={suggestion.field} className={styles.suggestionCard}>
            <div className={styles.suggestionHeader}>
              <span className={styles.suggestionLabel}>{suggestion.label}</span>
              {suggestion.field === 'companyName' && (
                <span className={styles.privateTag}>Private</span>
              )}
              {suggestion.field === 'anonymizedSummary' && (
                <span className={styles.publicTag}>Public</span>
              )}
            </div>

            {suggestion.isEditing ? (
              <div className={styles.suggestionEdit}>
                {suggestion.field === 'anonymizedSummary' ? (
                  <textarea
                    value={suggestion.editValue}
                    onChange={(e) => handleEditChange(index, e.target.value)}
                    rows={3}
                    className={styles.suggestionTextarea}
                    autoFocus
                  />
                ) : (
                  <input
                    type="text"
                    value={suggestion.editValue}
                    onChange={(e) => handleEditChange(index, e.target.value)}
                    className={styles.suggestionInput}
                    autoFocus
                  />
                )}
                <button
                  onClick={() => handleEditSave(index)}
                  className={styles.suggestionSaveBtn}
                >
                  Save
                </button>
              </div>
            ) : (
              <div
                className={`${styles.suggestionPill} ${
                  suggestion.accepted === true ? styles.accepted : ''
                } ${suggestion.accepted === false ? styles.rejected : ''}`}
              >
                <span className={styles.suggestionValue}>{suggestion.value}</span>
                
                {suggestion.accepted === null && (
                  <div className={styles.suggestionActions}>
                    <button
                      onClick={() => handleAccept(index)}
                      className={styles.acceptBtn}
                      title="Accept"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => handleReject(index)}
                      className={styles.rejectBtn}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                )}

                {suggestion.accepted === true && (
                  <div className={styles.suggestionActions}>
                    <span className={styles.acceptedBadge}>
                      <Check size={14} />
                    </span>
                    <button
                      onClick={() => handleEdit(index)}
                      className={styles.editBtn}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Category Selection */}
        <div className={styles.suggestionCard}>
          <div className={styles.suggestionHeader}>
            <span className={styles.suggestionLabel}>Category</span>
          </div>
          <div className={styles.categoryPills}>
            {categoryOptions_.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`${styles.categoryPill} ${
                  selectedCategory === cat ? styles.selected : ''
                }`}
              >
                {cat}
                {selectedCategory === cat && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className={styles.metricsCard}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Domain Rating</span>
            <span className={styles.metricValue}>{domainRating}</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Est. Reach</span>
            <span className={styles.metricValue}>~{reach?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={() => setPhase('input')}
          className={styles.secondaryButton}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!allAccepted}
          className={styles.primaryButton}
        >
          {allAccepted ? 'Continue' : 'Accept all to continue'}
        </button>
      </div>
    </div>
  );
}
