# CarBIO powered by SASA

Project title: **SASA**

Track 2: **DLT for Operations**

Please find our submission links below:
Pitch deck: https://drive.google.com/file/d/1I4TGvbNn5E2BMR8ZxC-AawAaKnPSz3Qs/view?usp=sharing 
Ndanu's Certificate: https://certs.hashgraphdev.com/41c661fe-fe7a-4452-a49f-f9e16284cba5.pdf 
Gatama's Certificate: https://certs.hashgraphdev.com/aad62f4e-db5b-4c8f-95b8-31fc4f51f8e6.pdf 

## Overview

SASA is a real-time biogas monitoring system that simulates microcontroller-meter data, stores it immutably on the Hedera TestNet, and displays it in a React dashboard. It is designed for IoT, environmental monitoring, and DLT transparency use cases.

## Architecture

┌───────────────┐ ┌──────────────────┐ ┌─────────────────┐

│ Simulator │─────▶│ Node.js Backend │─────▶│ Hedera Network │

│ (microcontroller)│ HTTP │ (Express API) │ SDK │ (Testnet Topic) │

└───────────────┘ └──────────────────┘ └─────────────────┘

                                                            │
                                                            
                                                            │ HTTP
                                                            
                                                            ▼
                                                            
                                                            ┌──────────────────┐
                                                            
                                                            │ React App │
                                                            
                                                            │ (Dashboard) │
                                                            
                                                            └──────────────────┘

## Components

### 1\. Simulator (simulator.js)

- Simulates a microcontroller by generating random biogas consumption data, gas pressure, CO2 concentration, Methane concentration, and detects H2S presence readings every 5 seconds.
- Sends readings to the backend via: HTTP POST /api/gas-reading.

### 2\. Node.js Backend (server.js)

- Receives meter data from the simulator.
- Adds metadata.
- Submits each reading to Hedera Consensus Service.
- Stores the last 100 readings in memory for quick access.
- Provides REST API endpoints for the React frontend:
- POST /api/gas-reading - Submit new reading
- GET /api/gas-readings - Get all readings
- GET /api/gas-readings/latest - Get latest reading
- GET /api/health - Health check
- POST /api/create-topic - Create a new Hedera topic

### 3\. Hedera Network

- Stores each reading as a message in a Hedera Topic (immutable, timestamped, verifiable record).
- Each message has a unique sequence number and transaction ID.
- Data can be viewed on [HashScan](https://hashscan.io/testnet/topic/0.0.7152310).

### 4\. React Dashboard (frontend)

- Fetches readings directly from Hedera Mirror Node.
- Displays:
- Current biogas consumed, gas pressure, CO2 concentration, methane concentration, H2S presence
- Status indicators (color-coded)
- Hedera transaction info
- Historical chart and table
- Updates every few seconds for real-time project data monitoring.

## Data Flow

- **Simulator** generates a reading:

- Example: { meter_id: "METER_001", biogas_consumed: 45.67, gas_pressure: 2.34, co2_conc: 12.5, methane_conc: 52.3, h2s_presence: "absent", location: "Lab" }

- **Node.js Backend** receives the reading:

- Adds metadata, submits to Hedera, stores data locally.

- **Hedera Network** stores the reading:

- Message is immutable, timestamped, and assigned a sequence number.

- **React Dashboard** fetches readings:

- Displays latest and historical data, including Hedera transaction info.

##

## Hedera Integration

### Overview

The Hedera Consensus Service (HCS) is used to store biogas meter readings immutably on the ledger. Each reading becomes a timestamped, verifiable message that cannot be altered or deleted, ensuring project data integrity. Hedera's low and predictable fees will enable the CarBIO dMRV to transmit data without incurring high transaction costs. This is crucial for achieving near-real-time data monitoring for a high-volume of meters. In turn, it will reduce operational expenses and promote adoption of climate-smart technology in Africa.

### Account Configuration

- **Account ID**: 0.0.7151381
- **Private Key**: 0xe54ee0c510f17773d34c74abb8ef3da40e50fd5857f0270ad654c2a433710a92 (ECDSA secp256k1)
- **Network**: Hedera TestNet
- **Balance**: Maintained with sufficient HBAR for transaction fees

### Topic Details

- **Topic ID**: 0.0.7152310
- **Topic Memo**: "CarBio Gas Monitoring Data"
- **Submit Key**: Controlled by the account above
- **Auto-Renew Account**: 0.0.7151381
- **Auto-Renew Period**: 30 days

### Consensus Service Mechanics

- **Message Submission**: Each meter reading is encoded as JSON and submitted as a **ConsensusSubmitMessage transaction.**
- **Timestamping**: Hedera automatically assigns a consensus timestamp when the message reaches consensus.
- **Sequence Numbers**: Each message gets a unique, monotonically increasing sequence number.
- **Transaction ID**: Unique identifier for each submission transaction.
- **Fee Structure**: ~0.01 HBAR per message (varies with network congestion)

### SDK Integration

The backend uses the Hedera JavaScript SDK (@hashgraph/sdk) for:

- Client initialization with TestNet configuration
- Topic creation (admin endpoint)
- Message submission with proper signing
- Error handling and transaction receipts

### Mirror Node API

The frontend fetches historical data directly from Hedera Mirror Nodes:

- **Endpoint**: <https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.7152310/messages>
- **Query Parameters**:

limit: Number of messages to retrieve (default: 25, max: 100)

order: asc/desc (default: desc)

- **Response Format**: JSON with consensus timestamps, sequence numbers, and message contents

### Security Features

- **Cryptographic Signing**: All transactions signed with ECDSA private key
- **Immutability**: Once submitted, messages cannot be modified or deleted
- **Verifiability**: Stakeholders can verify message authenticity via public APIs
- **Decentralized**: No single point of failure, distributed across Hedera network

### Transaction Flow

- Backend prepares message payload (JSON string)
- Signs transaction with private key
- Submits to Hedera network
- Receives transaction receipt with consensus timestamp
- Stores transaction details locally for frontend reference

##

## Monitoring and Verification

- **HashScan**: View all transactions at <https://hashscan.io/testnet/topic/0.0.7152310>
- **Transaction Status**: Check submission success via SDK receipts
- **Message Retrieval**: Verify data integrity by fetching from mirror nodes
- **Network Status**: Monitor Hedera network health via portal.hedera.com

###

### Transaction Types

#### 🧩 1. TopicCreateTransaction

**Purpose:** Creates a new topic on the Hedera Consensus Service (HCS). Topics are like message channels where clients can publish messages that are timestamped and ordered by the Hedera network.

**Where it appears:**

const transaction = new TopicCreateTransaction({

topicMemo: 'CarBio Gas Readings'

});

**Usage route:** POST /api/create-topic

**What it does:**

- Submits a transaction to create a new topic (message stream).
- Returns the newly created topicId, which can later be used to publish gas readings.

**Transaction Details:**

- **Signing Requirements**: Must be signed by the account's private key
- **Fee**: ~5 HBAR (one-time creation fee)
- **Receipt**: Returns new topic ID and confirmation

#### 📨 2. TopicMessageSubmitTransaction

**Purpose:** Publishes a message to an existing Hedera topic. This message is permanently recorded on Hedera with a consensus timestamp and sequence number.

**Where it appears:**

const transaction = new TopicMessageSubmitTransaction({

topicId: TopicId.fromString(TOPIC_ID),

message: message

});

**Usage route:** POST /api/gas-reading

**What it does:**

- Takes the gas reading data.
- Converts it to JSON and submits it as a message to the specified Hedera topic.
- Returns metadata:
- transaction_id: ID of the message submission transaction.
- sequence_number: Position of the message within the topic.

**Transaction Details:**

- **Signing Requirements**: Must be signed by the topic's submit key
- **Fee**: ~0.01 HBAR (varies with message size and network congestion)
- **Execution Time**: 2-5 seconds for consensus
- **Receipt**: Returns transaction ID, consensus timestamp, and sequence number

#### Transaction Response Structure

{

"transactionId": "0.0.1234567890-1234567890-123456789",

"status": "SUCCESS",

"consensusTimestamp": "2025-10-30T12:34:56.789Z",

"sequenceNumber": 42,

"runningHash": "base64-encoded-hash",

"runningHashVersion": 3

}

#### Economic Justification

Hedera's low and predictable fees enable the SASA dMRV to transact data without incurring high transaction costs, which is crucial for achieving near-real-time project data monitoring.

Hedera's high throughput enables the SASA dMRV to support a high volume of meters, providing room for scaling without compromising project data integrity.

Hedera's ABFT finality provides the highest degree of security possible within a consensus algorithm, allowing CarBIO to achieve high data-integrity standards.

**How to Use**

- **Start the Backend**

cd backend-node

npm install

npm start

- **Run the Simulator**

npm run simulator

- **Start the React Frontend**

cd ../frontend

npm install

npm start

- **View Data**
  - Open [http://localhost:3000](http://localhost:3000/) in your browser.
  - See real-time meter data, air quality status, and Hedera transaction info.
  - View all network messages on [HashScan](https://hashscan.io/testnet/topic/0.0.7152310).

**Direct Ledger Fetch**

- - React can fetch directly from Hedera Mirror Node API:
        - Endpoint: <https://testnet.mirrornode.hedera.com/api/v1/topics/&lt;TOPIC_ID&gt;/messages>
    - No backend required for viewing historical data.

**Links**

- - [**Hedera Portal**](https://portal.hedera.com/)
    - [**HashScan Explorer**](https://hashscan.io/testnet/topic/0.0.7152310)
    - **Hedera Mirror Node API**

**Technical Details**

**Backend API Specifications**

**POST /api/gas reading**

- - **Description**: Accepts gas meter readings from the simulator and submits them to Hedera.
    - **Request Body**:

{

"meter_id": "string", "biogas_consumed": "number", "gas_pressure": "number", "co2_conc": "number", "methane_conc": "number", "h2s_presence": "string", "location": "string"

}

- - **Response**:
        - 200 OK: { "status": "success", "transactionId": "string", "sequenceNumber": "number" }
        - 400 Bad Request: { "error": "Invalid data" }
        - 500 Internal Server Error: { "error": "Hedera submission failed" }

**GET /api/gas-readings**

- - **Description**: Retrieves the last 100 readings stored in memory.
    - **Response**: Array of reading objects with metadata.

**GET /api/gas-readings/latest**

- - **Description**: Returns the most recent reading.
    - **Response**: Single reading object.

**GET /api/health**

- - **Description**: Health check endpoint.
    - **Response**: { "status": "healthy", "timestamp": "ISO string" }

## POST /api/create-topic

- - **Description**: Creates a new Hedera topic (admin function).
    - **Response**: { "topicId": "string" }

## Data Structures Reading Object

{

"id": "string (UUID)", "timestamp": "ISO 8601 string", "meter_id": "string",

"biogas_consumed": "number (liters)", "gas_pressure": "number (psi)", "co2_conc": "number (percentage)", "methane_conc": "number (percentage)", "h2s_presence": "string (present/absent)", "location": "string",

"hedera": {

"transactionId": "string", "sequenceNumber": "number", "timestamp": "ISO 8601 string"

}

}

## Hedera Integration Details

- - **SDK Version**: @hashgraph/sdk v2.24.0
    - **Network**: Hedera Testnet
    - **Key Type**: ECDSA (secp256k1)
    - **Topic Memo**: "CarBio Gas Monitoring Data"
    - **Message Encoding**: JSON strings
    - **Consensus Timestamp**: Automatically assigned by Hedera network

## Simulator Implementation

- - **Language**: Node.js
    - **Interval**: 5000ms (configurable)

## Random Generation

- - - Biogas consumed: 0-100 liters
      - Gas pressure: 0-5 psi
      - CO2 concentration: 0-20%
      - Methane concentration: 40-60%
      - H2S presence: 10% chance of "present"
    - **HTTP Client**: Axios for POST requests

## Frontend Architecture

- - **Framework**: React 18 with Hooks
    - **State Management**: useState for local state
    - **Data Fetching**: Custom useHedera hook with polling
    - **Charts**: Chart.js for historical data visualization
    - **Styling**: CSS modules with responsive design
    - **Update Frequency**: 3000ms polling interval

## Environment Configuration

Create a .env file in the backend directory:

HEDERA_ACCOUNT_ID=0.0.7151381

HEDERA_PRIVATE_KEY=0xe54ee0c510f17773d34c74abb8ef3da40e50fd5857f0270ad654c2a433710a92 HEDERA_TOPIC_ID=0.0.7152310

PORT=3001
