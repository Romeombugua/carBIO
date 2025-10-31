import React from 'react';
import GasLevelCard from './GasLevelCard';
import ReadingsChart from './ReadingsChart';
import ReadingsTable from './ReadingsTable';
import './Dashboard.css';

function Dashboard({ readings, latestReading, hederaStatus }) {
  return (
    <div className="dashboard">
      {/* Current Readings Cards */}
      <div className="cards-grid">
        <GasLevelCard
          title="Biogas Consumed"
          value={latestReading?.biogas_consumed ?? 0}
          unit="L"
          status="info"
          icon="⛽"
        />
        
        <GasLevelCard
          title="Gas Pressure"
          value={latestReading?.gas_pressure ?? 0}
          unit="bar"
          status="info"
          icon="🔧"
        />
        
        <GasLevelCard
          title="CO2 Concentration"
          value={latestReading?.co2_conc ?? 0}
          unit="%"
          status="info"
          icon="🌫️"
        />
        
        <GasLevelCard
          title="Methane Concentration"
          value={latestReading?.methane_conc ?? 0}
          unit="%"
          status="info"
          icon="🔥"
        />
        
        <GasLevelCard
          title="H2S Presence"
          value={latestReading?.h2s_presence ?? 'N/A'}
          unit=""
          status={latestReading?.h2s_presence === 'present' ? 'poor' : 'good'}
          icon="⚠️"
          isText={true}
        />
        
        <GasLevelCard
          title="Meter Location"
          value={latestReading?.location ?? 'N/A'}
          unit=""
          status="info"
          icon="📍"
          isText={true}
        />
      </div>

      {/* Hedera Transaction Info */}
      {latestReading?.hedera?.success && (
        <div className="hedera-info">
          <h3>🔗 Latest Hedera Transaction</h3>
          <div className="hedera-details">
            <p><strong>Transaction ID:</strong> {latestReading.hedera.transaction_id}</p>
            <p><strong>Sequence Number:</strong> {latestReading.hedera.sequence_number}</p>
            <p><strong>Timestamp:</strong> {new Date(latestReading.timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="chart-container">
        <h3>📊 Gas Level Trends</h3>
        <ReadingsChart readings={readings} />
      </div>

      {/* Table */}
      <div className="table-container">
        <h3>📋 Recent Readings</h3>
        <ReadingsTable readings={readings.slice(-20).reverse()} />
      </div>
    </div>
  );
}

export default Dashboard;
