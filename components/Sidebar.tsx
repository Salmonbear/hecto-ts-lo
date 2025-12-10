import { useState } from 'react';
import {
  LayoutDashboard,
  Megaphone,
  Send,
  MessageSquare,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={22} />, href: '/app' },
  { id: 'campaigns', label: 'Campaigns', icon: <Megaphone size={22} />, href: '/app/campaigns' },
  { id: 'pitches', label: 'Pitches', icon: <Send size={22} />, href: '/app/pitches' },
  { id: 'messages', label: 'Messages', icon: <MessageSquare size={22} />, href: '/app/messages' },
  { id: 'profile', label: 'Profile', icon: <User size={22} />, href: '/app/profile' },
];

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (id: string) => void;
}

export default function Sidebar({ activeItem = 'dashboard', onNavigate }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate?.(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className={styles.mobileToggle}
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isExpanded ? styles.expanded : ''} ${
          isMobileOpen ? styles.mobileOpen : ''
        }`}
      >
        {/* Logo area */}
        <div className={styles.logoArea}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>H</span>
            {(isExpanded || isMobileOpen) && (
              <span className={styles.logoText}>hecto</span>
            )}
          </div>
          
          {/* Mobile close button */}
          <button
            className={styles.mobileClose}
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`${styles.navItem} ${
                    activeItem === item.id ? styles.active : ''
                  }`}
                  onClick={() => handleNavClick(item.id)}
                  title={!isExpanded && !isMobileOpen ? item.label : undefined}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {(isExpanded || isMobileOpen) && (
                    <span className={styles.navLabel}>{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop expand toggle */}
        <button
          className={styles.expandToggle}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </aside>
    </>
  );
}

