# CarBio Backend - Node.js Version

## Setup

### 1. Install Dependencies
```cmd
cd backend-node
npm install
```

### 2. Configure Environment
The `.env` file is already configured with your Hedera credentials.

### 3. Start the Server
```cmd
npm start
```

Or for development with auto-reload:
```cmd
npm run dev
```

### 4. Run the Simulator
In a new terminal:
```cmd
cd backend-node
npm run simulator
```

## API Endpoints

- `POST /api/gas-reading` - Submit new gas reading
- `GET /api/gas-readings` - Get all readings
- `GET /api/gas-readings/latest` - Get latest reading
- `GET /api/health` - Health check
- `POST /api/create-topic` - Create Hedera topic

## Features

✅ No Java setup needed (uses Node.js Hedera SDK)
✅ ECDSA key support built-in
✅ Real-time Hedera integration
✅ Same API as Python version (drop-in replacement)
✅ Auto-reload in dev mode

## Testing

1. Start server: `npm start`
2. Check health: http://localhost:5000/api/health
3. Start simulator: `npm run simulator`
4. Open React app: http://localhost:3000

The frontend doesn't need any changes - it will work with this Node.js backend!
