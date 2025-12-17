import { useState } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '../../components/AppLayout';
import styles from '../../styles/Pitch.module.css';

export default function PitchPage() {
  const router = useRouter();
  const { campaignId } = router.query;

  const [subject, setSubject] = useState('');
  const [pitchContent, setPitchContent] = useState('');

  return (
    <AppLayout title="Send Pitch" activeNav="dashboard">
      <div className={styles.pitchContainer}>
        {/* Left Column - Campaign Details */}
        <aside className={styles.campaignColumn}>
          <div className={styles.columnHeader}>
            <h2>Campaign</h2>
          </div>

          <div className={styles.campaignDetails}>
            <div className={styles.companyHeader}>
              <div className={styles.companyLogo}></div>
              <div>
                <h3>Company Name</h3>
                <p className={styles.companyTagline}>One liner goes here</p>
              </div>
            </div>

            <div className={styles.section}>
              <h4>Campaign Title</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>

            <div className={styles.section}>
              <h4>Objective</h4>
              <p>Placeholder objective text here</p>
            </div>

            <div className={styles.section}>
              <h4>Target Audience</h4>
              <p>Placeholder audience description</p>
            </div>

            <div className={styles.section}>
              <h4>Budget</h4>
              <p>$X,XXX - $X,XXX</p>
            </div>

            <div className={styles.metrics}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Match Score</span>
                <span className={styles.metricValue}>85</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Reach</span>
                <span className={styles.metricValue}>120K</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Middle Column - Pitch Editor */}
        <main className={styles.editorColumn}>
          <div className={styles.columnHeader}>
            <h2>Your Pitch</h2>
          </div>

          <div className={styles.editorContainer}>
            <div className={styles.editorToolbar}>
              <input
                type="text"
                placeholder="Subject line"
                className={styles.subjectInput}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <textarea
              className={styles.pitchEditor}
              value={pitchContent}
              onChange={(e) => setPitchContent(e.target.value)}
              placeholder="Write your pitch here..."
            />

            <div className={styles.editorFooter}>
              <button className={styles.secondaryButton}>Save Draft</button>
              <button className={styles.primaryButton}>Send Pitch</button>
            </div>
          </div>
        </main>

        {/* Right Column - Tips */}
        <aside className={styles.tipsColumn}>
          <div className={styles.columnHeader}>
            <h2>Pitching Tips</h2>
          </div>

          <div className={styles.tipsContent}>
            <div className={styles.tip}>
              <h4>Keep it concise</h4>
              <p>Get to the point quickly. Busy people appreciate brevity.</p>
            </div>

            <div className={styles.tip}>
              <h4>Show value</h4>
              <p>Explain what's in it for them. Focus on mutual benefits.</p>
            </div>

            <div className={styles.tip}>
              <h4>Be specific</h4>
              <p>Include concrete numbers and examples where possible.</p>
            </div>

            <div className={styles.tip}>
              <h4>Personalize it</h4>
              <p>Reference something specific about their campaign or brand.</p>
            </div>

            <div className={styles.tip}>
              <h4>Clear CTA</h4>
              <p>End with a clear next step or question.</p>
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
