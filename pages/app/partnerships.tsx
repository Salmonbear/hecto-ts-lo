import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import UserSelector from '../../components/UserSelector';
import styles from '../../styles/Partnerships.module.css';
import { Send, MessageCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

interface Pitch {
  id: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  campaign: {
    headline: string | null;
    company: {
      name: string | null;
      logoUrl: string | null;
    };
  };
  newsletter: {
    name: string | null;
    logoUrl: string | null;
  };
  sender: {
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  messages: Message[];
  _count: {
    messages: number;
  };
}

export default function PartnershipsPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [useRealData, setUseRealData] = useState(false);
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [isNewsletter, setIsNewsletter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!useRealData || !selectedUserId) {
      setPitches([]);
      return;
    }

    setLoading(true);
    fetch(`/api/partnerships?userId=${selectedUserId}`)
      .then((res) => res.json())
      .then((data) => {
        setPitches(data.pitches || []);
        setIsNewsletter(data.isNewsletter || false);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching partnerships:', err);
        setLoading(false);
      });
  }, [selectedUserId, useRealData]);

  const handleSelectPitch = (pitch: Pitch) => {
    setSelectedPitch(pitch);
    setLoadingMessages(true);
    fetch(`/api/pitches/${pitch.id}/messages`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoadingMessages(false);
      })
      .catch((err) => {
        console.error('Error fetching messages:', err);
        setLoadingMessages(false);
      });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <CheckCircle size={16} className={styles.statusAccepted} />;
      case 'declined':
        return <XCircle size={16} className={styles.statusDeclined} />;
      case 'pending':
        return <Clock size={16} className={styles.statusPending} />;
      default:
        return <Clock size={16} className={styles.statusPending} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return styles.statusAccepted;
      case 'declined':
        return styles.statusDeclined;
      case 'pending':
        return styles.statusPending;
      default:
        return styles.statusPending;
    }
  };

  return (
    <AppLayout title="My Partnerships" activeNav="partnerships">
      <UserSelector
        selectedUserId={selectedUserId}
        onUserSelect={setSelectedUserId}
        useRealData={useRealData}
        onToggleData={setUseRealData}
      />

      <div className={styles.container}>
        {loading ? (
          <div className={styles.loading}>Loading partnerships...</div>
        ) : !useRealData ? (
          <div className={styles.placeholder}>
            <p>Toggle to "Real DB" to view partnerships</p>
          </div>
        ) : pitches.length === 0 ? (
          <div className={styles.empty}>
            <Send size={48} />
            <h2>No partnerships yet</h2>
            <p>
              {isNewsletter
                ? "You haven't received any pitches from brands yet."
                : "You haven't sent any pitches to newsletters yet."}
            </p>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* Pitches List */}
            <div className={styles.pitchesList}>
              <div className={styles.listHeader}>
                <h2>
                  {isNewsletter ? 'Pitches Received' : 'Pitches Sent'}
                  <span className={styles.count}>({pitches.length})</span>
                </h2>
              </div>

              <div className={styles.pitchesContainer}>
                {pitches.map((pitch) => (
                  <button
                    key={pitch.id}
                    className={`${styles.pitchCard} ${
                      selectedPitch?.id === pitch.id ? styles.selected : ''
                    }`}
                    onClick={() => handleSelectPitch(pitch)}
                  >
                    <div className={styles.pitchHeader}>
                      <div className={styles.pitchTitle}>{pitch.subject}</div>
                      <div className={`${styles.status} ${getStatusClass(pitch.status)}`}>
                        {getStatusIcon(pitch.status)}
                        {pitch.status}
                      </div>
                    </div>

                    <div className={styles.pitchMeta}>
                      <div className={styles.company}>
                        {isNewsletter ? (
                          <>
                            <strong>From:</strong> {pitch.campaign.company.name || 'Unknown Brand'}
                          </>
                        ) : (
                          <>
                            <strong>To:</strong> {pitch.newsletter.name || 'Unknown Newsletter'}
                          </>
                        )}
                      </div>
                      <div className={styles.messageCount}>
                        <MessageCircle size={14} />
                        {pitch._count.messages} message{pitch._count.messages !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Panel */}
            <div className={styles.messagesPanel}>
              {!selectedPitch ? (
                <div className={styles.noSelection}>
                  <MessageCircle size={48} />
                  <p>Select a pitch to view the conversation</p>
                </div>
              ) : (
                <>
                  <div className={styles.messageHeader}>
                    <h3>{selectedPitch.subject}</h3>
                    <div className={`${styles.status} ${getStatusClass(selectedPitch.status)}`}>
                      {getStatusIcon(selectedPitch.status)}
                      {selectedPitch.status}
                    </div>
                  </div>

                  <div className={styles.messagesContainer}>
                    {loadingMessages ? (
                      <div className={styles.loadingMessages}>Loading messages...</div>
                    ) : messages.length === 0 ? (
                      <div className={styles.noMessages}>
                        <p>No messages yet</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`${styles.message} ${
                            msg.author.id === selectedUserId ? styles.myMessage : styles.theirMessage
                          }`}
                        >
                          <div className={styles.messageAuthor}>
                            {msg.author.firstName || msg.author.lastName
                              ? `${msg.author.firstName || ''} ${msg.author.lastName || ''}`.trim()
                              : msg.author.email}
                          </div>
                          <div className={styles.messageContent}>{msg.content}</div>
                          <div className={styles.messageTime}>
                            {new Date(msg.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className={styles.messageInput}>
                    <input
                      type="text"
                      placeholder="Type a message... (demo only, not connected)"
                      disabled
                    />
                    <button disabled>Send</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
