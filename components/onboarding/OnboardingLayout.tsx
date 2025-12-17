import { ReactNode } from 'react';
import styles from './OnboardingLayout.module.css';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps?: number;
}

const stepLabels = ['About You', 'Your Business', 'Support Needed', 'Review'];

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps = 4,
}: OnboardingLayoutProps) {
  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>H</span>
          <span className={styles.logoText}>hecto</span>
        </div>
      </header>

      {/* Progress */}
      <div className={styles.progressContainer}>
        <div className={styles.progressSteps}>
          {stepLabels.map((label, index) => (
            <div
              key={label}
              className={`${styles.step} ${
                index + 1 === currentStep ? styles.active : ''
              } ${index + 1 < currentStep ? styles.completed : ''}`}
            >
              <div className={styles.stepIndicator}>
                {index + 1 < currentStep ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M11.5 4L5.5 10L2.5 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={styles.stepLabel}>{label}</span>
            </div>
          ))}
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <main className={styles.content}>{children}</main>
    </div>
  );
}

