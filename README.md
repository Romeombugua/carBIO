# CarBio - Gas Monitoring System with Hedera

A real-time gas monitoring system that simulates microcontroller meter data, stores it on the Hedera network, and displays it in a React dashboard.

## 🏗️ Architecture

- **Backend**: Node.js/Express API that receives biogas readings and submits them to Hedera Consensus Service
- **Simulator**: Node.js script that simulates microcontroller meter readings
- **Frontend**: React dashboard to visualize biogas consumed, gas pressure, CO2 concentration, methane concentration, and H2S presence
- **Blockchain**: Hedera Hashgraph for immutable data storage

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- Hedera Testnet Account (free at https://portal.hedera.com)

## 🚀 Setup Instructions

### 1. Backend Setup

```cmd
cd backend

REM Install dependencies
npm install

REM Configure Hedera credentials
copy .env.example .env
REM Edit .env with your Hedera testnet credentials
```

### 2. Get Hedera Credentials

1. Go to https://portal.hedera.com/register
2. Create a free testnet account
3. Copy your Account ID and Private Key
4. Update `backend\.env` with your credentials:
   ```
   HEDERA_OPERATOR_ID=0.0.YOUR_ACCOUNT_ID
   HEDERA_OPERATOR_KEY=YOUR_PRIVATE_KEY
   ```

### 3. Create Hedera Topic

```cmd
REM Start the Express server
npm start

REM In another terminal, create a topic:
curl -X POST http://localhost:5000/api/create-topic
```

Copy the returned `topic_id` and add it to your `.env` file as `HEDERA_TOPIC_ID`.

### 4. Frontend Setup

```cmd
cd ..\frontend

REM Install dependencies
npm install

REM Start the React app
npm start
```

The frontend will open at http://localhost:3000

### 5. Start the Simulator

```cmd
cd ..\backend

REM Run the microcontroller simulator
node microcontroller_simulator.js
```

## 🎯 Usage

1. **Start Express Backend**: `npm start` (runs on port 5000)
2. **Start React Frontend**: `npm start` (runs on port 3000)
3. **Start Simulator**: `node microcontroller_simulator.js`

The simulator will send biogas readings every 5 seconds. You'll see:
- Real-time updates in the React dashboard
- Biogas consumption trends in the chart
- Recent readings in the table
- Hedera transaction IDs for each reading

## 📊 Dashboard Features

- **Real-time Monitoring**: Live biogas consumed, gas pressure, CO2 concentration, methane concentration, and H2S presence
- **Air Quality Status**: Color-coded indicators (Good/Moderate/Poor)
- **Trend Visualization**: Line charts showing historical data
- **Hedera Integration**: View transaction IDs and sequence numbers
- **Meter Location**: Track which meter sent the data

## 🔧 API Endpoints

- `POST /api/biogas-reading` - Submit new biogas reading
- `GET /api/biogas-readings` - Get all readings
- `GET /api/biogas-readings/latest` - Get latest reading
- `GET /api/health` - Health check
- `POST /api/create-topic` - Create Hedera topic

## 🌐 Hedera Integration

Each biogas reading is submitted to the Hedera Consensus Service, providing:
- **Immutable Storage**: Data cannot be altered or deleted
- **Timestamping**: Accurate record of when data was collected
- **Transparency**: Anyone can verify the data on Hedera
- **Low Cost**: Testnet is free, mainnet costs fractions of a cent

## 📝 Biogas Level Interpretation

- **< 800 ppm**: Good air quality (Green)
- **800-1500 ppm**: Moderate (Yellow/Orange)
- **> 1500 ppm**: Poor air quality (Red)

## 🛠️ Customization

### Change Simulator Interval

Edit `microcontroller_simulator.js`:
```javascript
runSimulator(interval=10);  // Send every 10 seconds
```

### Add More Meters

Edit `microcontroller_simulator.js`:
```javascript
const METER_ID = "METER_002";
const LOCATION = "Factory Floor B";
```

### Modify Gas Thresholds

Edit `frontend/src/components/Dashboard.js`:
```javascript
const getGasLevelStatus = (level) => {
  if (level < 500) return 'good';
  if (level < 1000) return 'moderate';
  return 'poor';
};
```

## 🐛 Troubleshooting

**Simulator can't connect to Express:**
- Make sure Express is running on port 5000
- Check that you're running the simulator from the correct directory

**Hedera errors:**
- Verify your `.env` credentials are correct
- Ensure you have HBAR in your testnet account
- Check that TOPIC_ID is set correctly

**React app won't start:**
- Delete `node_modules` and run `npm install` again
- Check that port 3000 is not in use

## 📄 License

MIT License - Feel free to use this project for your own purposes!

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.
