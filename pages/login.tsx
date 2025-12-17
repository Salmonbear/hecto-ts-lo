import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - redirect to dashboard (onboarding modal will show there)
    router.push('/app');
  };

  return (
    <div className={styles.container}>
      {/* Left side - Branding */}
      <div className={styles.brandingSide}>
        <div className={styles.brandingContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>H</span>
            <span className={styles.logoText}>hecto</span>
          </div>
          <h1 className={styles.tagline}>
            Find partners.<br />
            Grow together.
          </h1>
          <p className={styles.subtitle}>
            The anonymous partnership marketplace for brands and creators.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Welcome Back!</h2>
          <p className={styles.formSubtitle}>
            Sign in to access your Hecto account.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={styles.input}
                autoFocus
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Sign in with Email
            </button>
          </form>

          <p className={styles.signupPrompt}>
            Don't have an account?{' '}
            <a href="/signup" className={styles.signupLink}>
              Create a free account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

