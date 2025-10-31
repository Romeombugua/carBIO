import React from 'react';
import './ReadingsTable.css';

function ReadingsTable({ readings }) {
  if (readings.length === 0) {
    return (
      <div className="no-data">
        No readings available yet. Start the simulator to collect data.
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="readings-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Meter</th>
            <th>Biogas Consumed (L)</th>
            <th>Gas Pressure (bar)</th>
            <th>CO2 Conc (%)</th>
            <th>Methane Conc (%)</th>
            <th>H2S Presence</th>
            <th>Location</th>
            <th>Timestamp</th>
            <th>Hedera</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((reading) => (
            <tr key={reading.id}>
              <td>{reading.id}</td>
              <td>{reading.meter_id}</td>
              <td>
                <span className={`gas-badge ${
                  (reading.biogas_consumed ?? 0) < 800 ? 'good' : 
                  (reading.biogas_consumed ?? 0) < 1500 ? 'moderate' : 'poor'
                }`}>
                  {(reading.biogas_consumed ?? 0).toFixed(2)}
                </span>
              </td>
              <td>
                <span className={`gas-badge ${
                  (reading.gas_pressure ?? 0) < 1 ? 'good' : 
                  (reading.gas_pressure ?? 0) < 2 ? 'moderate' : 'poor'
                }`}>
                  {(reading.gas_pressure ?? 0).toFixed(2)}
                </span>
              </td>
              <td>
                <span className={`gas-badge ${
                  (reading.co2_conc ?? 0) < 0.5 ? 'good' : 
                  (reading.co2_conc ?? 0) < 1.5 ? 'moderate' : 'poor'
                }`}>
                  {(reading.co2_conc ?? 0).toFixed(2)}
                </span>
              </td>
              <td>
                <span className={`gas-badge ${
                  (reading.methane_conc ?? 0) < 0.5 ? 'good' : 
                  (reading.methane_conc ?? 0) < 1.5 ? 'moderate' : 'poor'
                }`}>
                  {(reading.methane_conc ?? 0).toFixed(2)}
                </span>
              </td>
              <td>
                <span className={`gas-badge ${(reading.h2s_presence ?? 'absent') === 'present' ? 'poor' : 'good'}`}>
                  {reading.h2s_presence ?? 'absent'}
                </span>
              </td>
              <td>{reading.location}</td>
              <td>{new Date(reading.timestamp).toLocaleString()}</td>
              <td>
                {reading.hedera?.success ? (
                  <span className="hedera-badge success" title={reading.hedera.transaction_id}>
                    ✓ Seq #{reading.hedera.sequence_number}
                  </span>
                ) : (
                  <span className="hedera-badge pending">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReadingsTable;
