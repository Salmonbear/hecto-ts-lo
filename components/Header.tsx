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
