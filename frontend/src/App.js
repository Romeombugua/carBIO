import { useHederaTopic, HederaStatus } from './hooks/useHedera';
import Dashboard from './components/Dashboard';
import './App.css';

// Your Hedera Topic ID
const HEDERA_TOPIC_ID = '0.0.7152310';

function App() {
  const { messages, loading, error } = useHederaTopic(HEDERA_TOPIC_ID);
  
  // Get latest reading
  const latestReading = messages.length > 0 ? messages[messages.length - 1] : null;
  
  // Format readings to match expected structure
  const formattedReadings = messages.map((msg) => {
    console.log('Raw message:', msg); // Debug log
    console.log('Meter ID from message:', msg.meter_id); // Debug log
    return {
      id: msg.sequence_number, // Use Hedera sequence_number for unique key
      meter_id: msg.meter_id || 'METER_001',
      biogas_consumed: msg.biogas_consumed ?? 0,
      gas_pressure: msg.gas_pressure ?? 0,
      co2_conc: msg.co2_conc ?? 0,
      methane_conc: msg.methane_conc ?? 0,
      h2s_presence: msg.h2s_presence ?? 'absent',
      timestamp: msg.timestamp ?? new Date().toISOString(),
      location: msg.location ?? 'Unknown',
      hedera: {
        success: true,
        transaction_id: msg.payer_account_id,
        sequence_number: msg.sequence_number
      }
    };
  });

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <img src="/Logos/Carbi__1_-removebg-preview.png" alt="CarBio Logo" className="carbio-logo" />
          <h1>Gas Monitoring System</h1>
        </div>
        <div className="status-bar">
          <HederaStatus topicId={HEDERA_TOPIC_ID} />
        </div>
      </header>

      <main className="App-main">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'white' }}>
            <h2>📡 Loading data from Hedera blockchain...</h2>
            <p>Fetching messages from topic {HEDERA_TOPIC_ID}</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'white' }}>
            <h2>❌ Error connecting to Hedera</h2>
            <p>{error}</p>
            <p>Make sure the topic ID is correct: {HEDERA_TOPIC_ID}</p>
          </div>
        ) : (
          <Dashboard 
            readings={formattedReadings} 
            latestReading={latestReading}
            hederaStatus="configured"
          />
        )}
      </main>

      <footer className="App-footer">
        <div className="footer-content">
          <div className="powered-by">
            <span>Powered by</span>
            <img src="/Logos/SASA_logo-removebg-preview.png" alt="SASA Logo" className="sasa-logo" />
            <span>SASA</span>
          </div>
          <div className="footer-info">
            <p>
              <a 
                href={`https://hashscan.io/testnet/topic/${HEDERA_TOPIC_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#60a5fa', marginLeft: '0.5rem' }}
              >
                View on HashScan ↗
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
