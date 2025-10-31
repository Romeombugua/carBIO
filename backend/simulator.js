import dotenv from 'dotenv';

dotenv.config();

// Configuration
const API_URL = 'http://localhost:5000/api/gas-reading';
const METER_ID = 'METER_001';
const LOCATION = 'Test A';
const INTERVAL = 5000; // 5 seconds

function generateGasReading() {
    // Simulate readings
    const biogasConsumed = Math.random() * (100 - 10) + 10; // liters
    const gasPressure = Math.random() * (5 - 1) + 1; // bar
    const co2Conc = Math.random() * (20 - 5) + 5; // percentage
    const methaneConc = Math.random() * (60 - 40) + 40; // percentage
    const h2sPresence = Math.random() > 0.5 ? 'present' : 'absent'; // presence
    
    return {
        meter_id: METER_ID,
        biogas_consumed: Math.round(biogasConsumed * 100) / 100,
        gas_pressure: Math.round(gasPressure * 100) / 100,
        co2_conc: Math.round(co2Conc * 100) / 100,
        methane_conc: Math.round(methaneConc * 100) / 100,
        h2s_presence: h2sPresence,
        location: LOCATION
    };
}

async function sendReading(reading) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reading)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const now = new Date().toLocaleTimeString();
            console.log(`✓ Reading sent successfully at ${now}`);
            console.log(`  Meter ID: ${reading.meter_id}`);
            console.log(`  Biogas Consumed: ${reading.biogas_consumed} L`);
            console.log(`  Gas Pressure: ${reading.gas_pressure} bar`);
            console.log(`  CO2 Conc: ${reading.co2_conc}%`);
            console.log(`  Methane Conc: ${reading.methane_conc}%`);
            console.log(`  H2S Presence: ${reading.h2s_presence}`);
            
            if (data.data?.hedera?.success) {
                console.log(`  Hedera Tx: ${data.data.hedera.transaction_id}`);
            }
            console.log();
            return true;
        } else {
            console.error(`✗ Error: ${response.status} - ${data.message || 'Unknown error'}`);
            return false;
        }
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('✗ Cannot connect to server. Is it running on port 5000?');
        } else {
            console.error(`✗ Error: ${error.message}`);
        }
        return false;
    }
}

async function runSimulator() {
    console.log('='.repeat(60));
    console.log('CarBio Microcontroller Simulator (Node.js)');
    console.log('='.repeat(60));
    console.log(`Meter ID: ${METER_ID}`);
    console.log(`Location: ${LOCATION}`);
    console.log(`Sending readings every ${INTERVAL / 1000} seconds`);
    console.log(`Target API: ${API_URL}`);
    console.log('='.repeat(60));
    console.log('\nPress Ctrl+C to stop\n');
    
    let count = 0;
    
    setInterval(async () => {
        const reading = generateGasReading();
        if (await sendReading(reading)) {
            count++;
        }
    }, INTERVAL);
}

runSimulator();
