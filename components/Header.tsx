import { Search, Bell } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Dashboard' }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.actions}>
        {/* Search */}
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
          />
        </div>

        {/* Notifications */}
        <button className={styles.iconButton} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.notificationBadge}>3</span>
        </button>

        {/* User avatar */}
        <button className={styles.avatarButton} aria-label="User menu">
          <div className={styles.avatar}>
            <span>SB</span>
          </div>
        </button>
      </div>
    </header>
  );
}

