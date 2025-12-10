import { X, Send, Bookmark, Globe, Target, Users, Calendar } from 'lucide-react';
import { Campaign } from './DataTable';
import styles from './CampaignPanel.module.css';

interface CampaignPanelProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onPitch?: (campaign: Campaign) => void;
  onSave?: (campaign: Campaign) => void;
}

export default function CampaignPanel({
  campaign,
  isOpen,
  onClose,
  onPitch,
  onSave,
}: CampaignPanelProps) {
  if (!campaign) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        {/* Header */}
        <header className={styles.header}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
          <div className={styles.headerActions}>
            <button
              className={styles.saveButton}
              onClick={() => onSave?.(campaign)}
              title="Save campaign"
            >
              <Bookmark size={18} />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className={styles.content}>
          {/* Category header */}
          <div className={styles.categoryHeader}>
            <div className={styles.categoryIcon}>
              <span>{campaign.audience?.categories?.[0]?.charAt(0) || '?'}</span>
            </div>
            <div className={styles.categoryInfo}>
              <h3 className={styles.categoryName}>{campaign.audience?.categories?.[0] || 'Uncategorized'}</h3>
              <p className={styles.categorySubtext}>Anonymous campaign</p>
            </div>
          </div>

          {/* Title */}
          <h2 className={styles.title}>{campaign.title}</h2>

          {/* Summary */}
          <p className={styles.summary}>{campaign.summary}</p>

          {/* Objective */}
          {campaign.objective && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>
                <Target size={16} />
                Objective
              </h4>
              <p className={styles.sectionText}>{campaign.objective}</p>
            </section>
          )}

          {/* Audience */}
          {campaign.audience && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>
                <Users size={16} />
                Target Audience
              </h4>
              <p className={styles.sectionText}>{campaign.audience.target_audience}</p>
              <div className={styles.tags}>
                {campaign.audience.categories.map((cat) => (
                  <span key={cat} className={styles.tag}>{cat}</span>
                ))}
              </div>
              <p className={styles.geography}>
                <Globe size={14} />
                {campaign.audience.geography}
              </p>
            </section>
          )}

          {/* Partnership types */}
          {campaign.partnership_types_considered && campaign.partnership_types_considered.length > 0 && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>Partnership Types</h4>
              <div className={styles.tags}>
                {campaign.partnership_types_considered.map((type) => (
                  <span key={type} className={styles.tag}>{type}</span>
                ))}
              </div>
            </section>
          )}

          {/* Constraints / Timeline */}
          {campaign.constraints && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>
                <Calendar size={16} />
                Details
              </h4>
              {campaign.constraints.timeline && (
                <p className={styles.sectionText}>{campaign.constraints.timeline}</p>
              )}
              {campaign.constraints.ideal_partner && (
                <p className={styles.detailItem}>
                  <strong>Ideal partner:</strong> {campaign.constraints.ideal_partner}
                </p>
              )}
              {campaign.constraints.budget && (
                <p className={styles.detailItem}>
                  <strong>Budget:</strong> {campaign.constraints.budget}
                </p>
              )}
            </section>
          )}

        </div>

        {/* Footer actions */}
        <footer className={styles.footer}>
          <button
            className={styles.pitchButton}
            onClick={() => onPitch?.(campaign)}
          >
            <Send size={18} />
            Send Pitch
          </button>
        </footer>
      </aside>
    </>
  );
}

