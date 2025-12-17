import { useState } from 'react';
import { useRouter } from 'next/router';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import StepAboutYou from '../../components/onboarding/StepAboutYou';
import StepYourBusiness from '../../components/onboarding/StepYourBusiness';
import StepSupportNeeded from '../../components/onboarding/StepSupportNeeded';
import StepReview from '../../components/onboarding/StepReview';

// Types for all onboarding data
interface OnboardingData {
  // Step 1: About You
  fullName: string;
  position: string;
  
  // Step 2: Your Business
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
  
  // Step 3: Support Needed
  partnershipTypes: string[];
  context: string;
  targetAudience: string;
  geography: string[];
  
  // Step 4: Generated
  listingTitle: string;
  listingSummary: string;
}

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

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);

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
    
    // In a real app, save to database here
    console.log('Launching with data:', { ...data, ...stepData });
    
    // Redirect to dashboard
    router.push('/app');
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <OnboardingLayout currentStep={currentStep}>
      {currentStep === 1 && (
        <StepAboutYou
          initialData={{
            fullName: data.fullName,
            position: data.position,
            email: '', // Would come from auth context
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
    </OnboardingLayout>
  );
}

