import { useEffect, useState } from 'react';

/**
 * Hook to fetch messages directly from Hedera Mirror Node
 */
export function useHederaTopic(topicId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!topicId) {
      setError('No topic ID provided');
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        // Hedera Mirror Node REST API
        const url = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages?limit=100&order=desc`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Decode messages from base64
        const decodedMessages = data.messages.map(msg => {
          try {
            // Decode base64 message
            const decodedMessage = atob(msg.message);
            const parsedData = JSON.parse(decodedMessage);
            
            return {
              ...parsedData,
              consensus_timestamp: msg.consensus_timestamp,
              sequence_number: msg.sequence_number,
              payer_account_id: msg.payer_account_id
            };
          } catch (e) {
            console.error('Failed to decode message:', e);
            return null;
          }
        }).filter(Boolean);
        
        setMessages(decodedMessages.reverse()); // Oldest first
        setLoading(false);
        
      } catch (err) {
        console.error('Error fetching from Hedera:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMessages();
    
    // Poll every 5 seconds for new messages
    const interval = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(interval);
  }, [topicId]);

  return { messages, loading, error };
}

/**
 * Component to display Hedera connection status
 */
export function HederaStatus({ topicId }) {
  const { loading, error } = useHederaTopic(topicId);
  
  if (loading) {
    return (
      <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
        📡 Connecting to Hedera Mirror Node...
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ padding: '1rem', background: '#f8d7da', borderRadius: '8px', color: '#721c24' }}>
        ❌ Error: {error}
      </div>
    );
  }
  
  return (
    <div style={{ padding: '1rem', background: '#d4edda', borderRadius: '8px', color: '#155724' }}>
      Connected to Hedera | Topic: {topicId}
    </div>
  );
}
