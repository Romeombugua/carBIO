import React from 'react';
import './GasLevelCard.css';

function GasLevelCard({ title, value, unit, status, icon, isText = false }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return '#22c55e';
      case 'moderate':
        return '#f59e0b';
      case 'poor':
        return '#ef4444';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'good':
        return 'Good Air Quality';
      case 'moderate':
        return 'Moderate';
      case 'poor':
        return 'Poor Air Quality';
      default:
        return '';
    }
  };

  return (
    <div className="gas-level-card" style={{ borderLeft: `4px solid ${getStatusColor(status)}` }}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      
      <div className="card-value">
        {isText ? (
          <span className="text-value">{value}</span>
        ) : (
          <>
            <span className="value">{typeof value === 'number' ? value.toFixed(2) : value}</span>
            {unit && <span className="unit">{unit}</span>}
          </>
        )}
      </div>
      
      {getStatusLabel(status) && (
        <div className="card-status" style={{ color: getStatusColor(status) }}>
          {getStatusLabel(status)}
        </div>
      )}
    </div>
  );
}

export default GasLevelCard;
