import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
    Client,
    AccountId,
    PrivateKey,
    TopicMessageSubmitTransaction,
    TopicCreateTransaction,
    TopicId
} from '@hashgraph/sdk';

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Hedera configuration
const OPERATOR_ID = process.env.HEDERA_OPERATOR_ID;
const OPERATOR_KEY = process.env.HEDERA_OPERATOR_KEY;
const TOPIC_ID = process.env.HEDERA_TOPIC_ID;

// In-memory storage
let gasReadings = [];

// Get Hedera client
function getHederaClient() {
    try {
        const client = Client.forTestnet();
        
        if (OPERATOR_ID && OPERATOR_KEY) {
            const operatorAccount = AccountId.fromString(OPERATOR_ID);
            const operatorKey = PrivateKey.fromStringECDSA(OPERATOR_KEY);
            client.setOperator(operatorAccount, operatorKey);
        }
        
        return client;
    } catch (error) {
        console.error('Error initializing Hedera client:', error);
        return null;
    }
}

// Submit to Hedera
async function submitToHedera(data) {
    const client = getHederaClient();
    
    if (!client || !TOPIC_ID) {
        console.log('⚠️  Hedera not configured, storing locally only');
        return null;
    }
    
    try {
        const message = JSON.stringify(data);
        
        console.log(`📤 Submitting to Hedera topic ${TOPIC_ID}...`);
        
        const transaction = new TopicMessageSubmitTransaction({
            topicId: TopicId.fromString(TOPIC_ID),
            message: message
        });
        
        const response = await transaction.execute(client);
        const receipt = await response.getReceipt(client);
        
        const result = {
            success: true,
            transaction_id: response.transactionId.toString(),
            sequence_number: receipt.topicSequenceNumber.toString()
        };
        
        console.log(`✅ Hedera submission successful!`);
        console.log(`   Transaction ID: ${result.transaction_id}`);
        console.log(`   Sequence #: ${result.sequence_number}`);
        
        client.close();
        return result;
        
    } catch (error) {
        console.error(`❌ Error submitting to Hedera:`, error.message);
        client.close();
        return { success: false, error: error.message };
    }
}

// Routes
app.post('/api/gas-reading', async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data:', data);
        
        const reading = {
            id: gasReadings.length + 1,
            meter_id: data.meter_id || 'unknown',
            biogas_consumed: data.biogas_consumed,
            gas_pressure: data.gas_pressure,
            co2_conc: data.co2_conc,
            methane_conc: data.methane_conc,
            h2s_presence: data.h2s_presence,
            timestamp: new Date().toISOString(),
            location: data.location || 'Unknown'
        };
        
        // Submit to Hedera
        const hederaResult = await submitToHedera(reading);
        if (hederaResult) {
            reading.hedera = hederaResult;
            console.log(`✓ Reading #${reading.id} - Hedera: ${hederaResult.success}`);
        } else {
            console.log(`✓ Reading #${reading.id} - Stored locally only`);
        }
        
        // Store locally
        gasReadings.push(reading);
        
        // Keep only last 100 readings
        if (gasReadings.length > 100) {
            gasReadings.shift();
        }
        
        res.status(201).json({
            success: true,
            message: 'Gas reading received',
            data: reading
        });
        
    } catch (error) {
        console.error('Error processing reading:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/gas-readings', (req, res) => {
    res.json({
        success: true,
        count: gasReadings.length,
        data: gasReadings
    });
});

app.get('/api/gas-readings/latest', (req, res) => {
    if (gasReadings.length > 0) {
        res.json({
            success: true,
            data: gasReadings[gasReadings.length - 1]
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'No readings available'
        });
    }
});

app.get('/api/health', (req, res) => {
    const hederaStatus = (OPERATOR_ID && OPERATOR_KEY && TOPIC_ID) 
        ? 'configured' 
        : 'not configured';
    
    res.json({
        status: 'online',
        hedera: hederaStatus,
        readings_count: gasReadings.length
    });
});

app.post('/api/create-topic', async (req, res) => {
    const client = getHederaClient();
    
    if (!client) {
        return res.status(400).json({
            success: false,
            error: 'Hedera client not configured. Please check your .env file.'
        });
    }
    
    try {
        const transaction = new TopicCreateTransaction({
            topicMemo: 'CarBio Gas Readings'
        });
        
        const response = await transaction.execute(client);
        const receipt = await response.getReceipt(client);
        const topicId = receipt.topicId;
        
        client.close();
        
        res.json({
            success: true,
            topic_id: topicId.toString(),
            message: 'Topic created successfully! Add this topic ID to your .env file as HEDERA_TOPIC_ID'
        });
        
    } catch (error) {
        client.close();
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log('=' .repeat(60));
    console.log('🚀 CarBio Backend Server');
    console.log('=' .repeat(60));
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Hedera Status: ${(OPERATOR_ID && OPERATOR_KEY && TOPIC_ID) ? '✓ Configured' : '⚠️  Not Configured'}`);
    if (OPERATOR_ID) console.log(`Account ID: ${OPERATOR_ID}`);
    if (TOPIC_ID) console.log(`Topic ID: ${TOPIC_ID}`);
    console.log('=' .repeat(60));
});
