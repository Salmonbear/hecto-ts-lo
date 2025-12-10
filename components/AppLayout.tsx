import { useState, ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  activeNav?: string;
}

export default function AppLayout({
  children,
  title = 'Dashboard',
  activeNav = 'dashboard',
}: AppLayoutProps) {
  const [currentNav, setCurrentNav] = useState(activeNav);

  const handleNavigate = (id: string) => {
    setCurrentNav(id);
    // In a real app, you'd use Next.js router here
  };

  return (
    <div className={styles.layout}>
      <Sidebar activeItem={currentNav} onNavigate={handleNavigate} />
      
      <div className={styles.main}>
        <Header title={title} />
        
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

