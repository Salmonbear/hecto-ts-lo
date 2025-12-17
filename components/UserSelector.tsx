import { useEffect, useState } from 'react';
import styles from './UserSelector.module.css';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  companies: Array<{
    id: string;
    name: string | null;
    isNewsletter: boolean;
  }>;
}

interface UserSelectorProps {
  selectedUserId: string | null;
  onUserSelect: (userId: string) => void;
  useRealData: boolean;
  onToggleData: (useReal: boolean) => void;
}

export default function UserSelector({ selectedUserId, onUserSelect, useRealData, onToggleData }: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Default user with campaigns (Matteo from ArtisticHive)
  const DEFAULT_USER_WITH_CAMPAIGNS = '1765326568091x658226133868242400';

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
        // Auto-select default user with campaigns if none selected
        if (!selectedUserId && data.length > 0) {
          // Check if default user exists in the list
          const defaultUser = data.find((u: User) => u.id === DEFAULT_USER_WITH_CAMPAIGNS);
          const selectedId = defaultUser ? defaultUser.id : data[0].id;
          onUserSelect(selectedId);
        }
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, [mounted]);

  // Auto-select user with campaigns when toggling to Real DB
  useEffect(() => {
    if (!mounted) return;

    if (useRealData && users.length > 0 && !selectedUserId) {
      const defaultUser = users.find(u => u.id === DEFAULT_USER_WITH_CAMPAIGNS);
      const selectedId = defaultUser ? defaultUser.id : users[0].id;
      onUserSelect(selectedId);
    }
  }, [useRealData, users, mounted]);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const getUserDisplayName = (user: User) => {
    const name = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || user.email;

    const companyCount = user.companies.length;
    const campaignType = user.companies.some(c => !c.isNewsletter) ? 'Brand' :
                         user.companies.some(c => c.isNewsletter) ? 'Newsletter' : 'User';

    return `${name} (${companyCount} ${companyCount === 1 ? 'company' : 'companies'})`;
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className={styles.selectorContainer}>
        <div className={styles.label}>Viewing as:</div>
        <div className={styles.dropdown}>
          <button className={styles.dropdownButton} disabled>
            Loading...
          </button>
        </div>
        <div className={styles.toggleContainer}>
          <span className={styles.toggleLabel}>Data Source:</span>
          <button className={styles.toggle} disabled>
            <span className={styles.toggleOption}>Mock</span>
            <span className={styles.toggleOption}>Real DB</span>
            <span className={styles.toggleSlider} />
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className={styles.selector}>Loading users...</div>;
  }

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.label}>Viewing as:</div>
      <div className={styles.dropdown}>
        <button
          className={styles.dropdownButton}
          onClick={() => setIsOpen(!isOpen)}
          disabled={!useRealData}
        >
          {selectedUser ? getUserDisplayName(selectedUser) : 'Select a user'}
          <span className={styles.arrow}>▼</span>
        </button>

        {isOpen && (
          <div className={styles.dropdownMenu}>
            {users.map((user) => (
              <button
                key={user.id}
                className={`${styles.dropdownItem} ${user.id === selectedUserId ? styles.selected : ''}`}
                onClick={() => {
                  onUserSelect(user.id);
                  setIsOpen(false);
                }}
              >
                <div className={styles.userName}>{getUserDisplayName(user)}</div>
                <div className={styles.userEmail}>{user.email}</div>
                {user.companies.length > 0 && (
                  <div className={styles.userCompanies}>
                    {user.companies.map(c => c.name).filter(Boolean).join(', ') || 'No company names'}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Data Source Toggle */}
      <div className={styles.toggleContainer}>
        <span className={styles.toggleLabel}>Data Source:</span>
        <button
          className={`${styles.toggle} ${useRealData ? styles.toggleActive : ''}`}
          onClick={() => onToggleData(!useRealData)}
        >
          <span className={styles.toggleOption}>Mock</span>
          <span className={styles.toggleOption}>Real DB</span>
          <span className={`${styles.toggleSlider} ${useRealData ? styles.sliderActive : ''}`} />
        </button>
      </div>
    </div>
  );
}
