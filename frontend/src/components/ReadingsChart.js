import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ReadingsChart({ readings }) {
  // Format data for chart (last 20 readings)
  const chartData = readings.slice(-20).map((reading, index) => ({
    name: `#${reading.id}`,
    biogasConsumed: reading.biogas_consumed ?? 0,
    gasPressure: reading.gas_pressure ?? 0,
    co2Conc: reading.co2_conc ?? 0,
    methaneConc: reading.methane_conc ?? 0,
    time: new Date(reading.timestamp).toLocaleTimeString()
  }));

  if (chartData.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
        No data available. Start the simulator to see gas readings.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: '1px solid #ccc',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="biogasConsumed" 
          stroke="#8b5cf6" 
          strokeWidth={2}
          name="Biogas Consumed (L)"
          dot={{ r: 4 }}
        />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="gasPressure" 
          stroke="#ef4444" 
          strokeWidth={2}
          name="Gas Pressure (bar)"
          dot={{ r: 4 }}
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="co2Conc" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="CO2 Conc (%)"
          dot={{ r: 4 }}
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="methaneConc" 
          stroke="#10b981" 
          strokeWidth={2}
          name="Methane Conc (%)"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ReadingsChart;
