import { useState } from 'react';
import { User, Globe, Handshake, Rocket, Check } from 'lucide-react';
import styles from './OnboardingModal.module.css';

// Import step components
import StepAboutYou from './onboarding/StepAboutYou';
import StepYourBusiness from './onboarding/StepYourBusiness';
import StepSupportNeeded from './onboarding/StepSupportNeeded';
import StepReview from './onboarding/StepReview';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

interface OnboardingData {
  fullName: string;
  position: string;
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
  partnershipTypes: string[];
  context: string;
  targetAudience: string;
  geography: string[];
  listingTitle: string;
  listingSummary: string;
}

const steps = [
  {
    id: 1,
    icon: User,
    title: 'About You',
    description: 'Tell us who you are',
  },
  {
    id: 2,
    icon: Globe,
    title: 'Your Business',
    description: 'We\'ll analyze your brand',
  },
  {
    id: 3,
    icon: Handshake,
    title: 'Support Needed',
    description: 'What are you looking for?',
  },
  {
    id: 4,
    icon: Rocket,
    title: 'Launch',
    description: 'Review and go live',
  },
];

const initialData: OnboardingData = {
  fullName: '',
  position: '',
  websiteUrl: '',
  linkedinUrl: '',
  twitterUrl: '',
  instagramUrl: '',
  newsletterUrl: '',
  companyName: '',
  oneLiner: '',
  category: '',
  anonymizedSummary: '',
  domainRating: null,
  reach: null,
  partnershipTypes: [],
  context: '',
  targetAudience: '',
  geography: [],
  listingTitle: '',
  listingSummary: '',
};

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);

  if (!isOpen) return null;

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleStep1Next = (stepData: { fullName: string; position: string }) => {
    updateData(stepData);
    setCurrentStep(2);
  };

  const handleStep2Next = (stepData: {
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
  }) => {
    updateData(stepData);
    setCurrentStep(3);
  };

  const handleStep3Next = (stepData: {
    partnershipTypes: string[];
    context: string;
    targetAudience: string;
    geography: string[];
  }) => {
    updateData(stepData);
    setCurrentStep(4);
  };

  const handleLaunch = (stepData: { title: string; summary: string }) => {
    updateData({
      listingTitle: stepData.title,
      listingSummary: stepData.summary,
    });
    console.log('Onboarding complete:', { ...data, ...stepData });
    onComplete();
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Left Sidebar - Steps */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            {/* Logo */}
            <div className={styles.logo}>
              <span className={styles.logoIcon}>H</span>
              <span className={styles.logoText}>hecto</span>
            </div>

            {/* Steps */}
            <nav className={styles.steps}>
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div
                    key={step.id}
                    className={`${styles.step} ${isActive ? styles.active : ''} ${
                      isCompleted ? styles.completed : ''
                    }`}
                  >
                    <div className={styles.stepIcon}>
                      {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
                    </div>
                    <div className={styles.stepContent}>
                      <span className={styles.stepTitle}>{step.title}</span>
                      <span className={styles.stepDescription}>{step.description}</span>
                    </div>
                    {index < steps.length - 1 && <div className={styles.stepLine} />}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Decorative background */}
          <div className={styles.sidebarDecor} />
        </aside>

        {/* Right Content */}
        <main className={styles.content}>
          <div className={styles.contentInner}>
            {currentStep === 1 && (
              <StepAboutYou
                initialData={{
                  fullName: data.fullName,
                  position: data.position,
                  email: '',
                }}
                onNext={handleStep1Next}
              />
            )}

            {currentStep === 2 && (
              <StepYourBusiness
                initialData={{
                  websiteUrl: data.websiteUrl,
                  linkedinUrl: data.linkedinUrl,
                  twitterUrl: data.twitterUrl,
                  instagramUrl: data.instagramUrl,
                  newsletterUrl: data.newsletterUrl,
                  companyName: data.companyName,
                  oneLiner: data.oneLiner,
                  category: data.category,
                  anonymizedSummary: data.anonymizedSummary,
                  domainRating: data.domainRating,
                  reach: data.reach,
                }}
                onNext={handleStep2Next}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && (
              <StepSupportNeeded
                initialData={{
                  partnershipTypes: data.partnershipTypes,
                  context: data.context,
                  targetAudience: data.targetAudience,
                  geography: data.geography,
                }}
                onNext={handleStep3Next}
                onBack={handleBack}
              />
            )}

            {currentStep === 4 && (
              <StepReview
                companyData={{
                  category: data.category,
                  anonymizedSummary: data.anonymizedSummary,
                  domainRating: data.domainRating,
                  reach: data.reach,
                }}
                supportData={{
                  partnershipTypes: data.partnershipTypes,
                  context: data.context,
                  targetAudience: data.targetAudience,
                  geography: data.geography,
                }}
                generatedData={
                  data.listingTitle
                    ? { title: data.listingTitle, summary: data.listingSummary }
                    : undefined
                }
                onLaunch={handleLaunch}
                onBack={handleBack}
              />
            )}
          </div>

          {/* Progress dots */}
          <div className={styles.progressDots}>
            {steps.map((step) => (
              <div
                key={step.id}
                className={`${styles.dot} ${currentStep >= step.id ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}


