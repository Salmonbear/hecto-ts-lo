import { useState } from 'react';
import styles from './OnboardingSteps.module.css';

interface StepAboutYouProps {
  initialData?: {
    fullName: string;
    position: string;
    email: string;
  };
  onNext: (data: { fullName: string; position: string }) => void;
}

const positionOptions = [
  { value: 'founder', label: 'Founder / CEO' },
  { value: 'marketing', label: 'Marketing Lead' },
  { value: 'growth', label: 'Growth / Partnerships' },
  { value: 'content', label: 'Content / Creator' },
  { value: 'agency', label: 'Agency (on behalf of client)' },
  { value: 'other', label: 'Other' },
];

export default function StepAboutYou({ initialData, onNext }: StepAboutYouProps) {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [position, setPosition] = useState(initialData?.position || '');

  const isValid = fullName.trim() && position;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext({ fullName, position });
    }
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>Let's get you set up</h1>
        <p className={styles.stepSubtitle}>
          Tell us a bit about yourself so we can personalize your experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="fullName" className={styles.label}>
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your name"
            className={styles.input}
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="position" className={styles.label}>
            Your role
          </label>
          <select
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className={styles.select}
          >
            <option value="">Select your position</option>
            {positionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={styles.primaryButton}
        >
          Continue
        </button>
      </form>
    </div>
  );
}

