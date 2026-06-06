# Apurv Patel Portfolio Backend

Node.js backend for portfolio website analytics. Tracks visitors, detects platform/device info, stores data in MongoDB, and provides real-time updates via Socket.IO.

## Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Socket.IO** (real-time visitor updates)
- **ua-parser-js** (platform / browser / OS detection)

## Project Structure

```
├── server.js                 # App entry point
├── src/
│   ├── app.js                # Express app setup
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Route handlers
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── sockets/              # Socket.IO setup
│   ├── utils/                # Helpers (user-agent parsing)
│   └── middlewares/          # Error handling
└── postman/                  # Postman collection
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB database

### Installation

```bash
git clone https://github.com/Apurv3027/Apurv-Patel-Portfolio-Backend.git
cd apurv-patel-portfolio-backend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
CLIENT_URL=http://localhost:3000
```

| Variable     | Description                          |
| ------------ | ------------------------------------ |
| `PORT`       | Server port (default: `5000`)        |
| `MONGO_URI`  | MongoDB connection string            |
| `CLIENT_URL` | Frontend URL for CORS & Socket.IO    |

### Run the Server

```bash
# Development (with nodemon)
npm run dev

# Production
node server.js
```

Server runs at `http://localhost:5000`.

## API Endpoints

Base path: `/api/analytics`

| Method | Endpoint           | Description                                      |
| ------ | ------------------ | ------------------------------------------------ |
| POST   | `/track`           | Track a visitor                                  |
| GET    | `/total`           | Total visitor count                              |
| GET    | `/by-date`         | Visitors grouped by date                         |
| GET    | `/by-country`      | Visitors grouped by country                      |
| GET    | `/device-stats`    | Mobile / tablet / desktop breakdown              |
| GET    | `/platform-stats`  | iOS / Android / Windows / macOS breakdown        |
| GET    | `/recent`          | Last 10 visitors                                 |
| GET    | `/visitors`        | Paginated visitor list                           |
| GET    | `/active-users`    | Active visitors (last 5 minutes)                 |
| GET    | `/realtime`        | Full real-time dashboard data                    |

### Track Visitor

```bash
curl -X POST http://localhost:5000/api/analytics/track \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36" \
  -d '{
    "sessionId": "session-001",
    "page": "/",
    "city": "Mumbai",
    "country": "India",
    "countryCode": "IN"
  }'
```

**Request body**

| Field         | Required | Description                    |
| ------------- | -------- | ------------------------------ |
| `sessionId`   | Yes      | Unique session identifier      |
| `page`        | No       | Page path (default: `/`)       |
| `city`        | No       | Visitor city                   |
| `country`     | No       | Visitor country                |
| `countryCode` | No       | Country code (e.g. `IN`)       |

Platform, browser, OS, and device are detected automatically from the `User-Agent` header.

### Paginated Visitors

```bash
# All visitors
curl "http://localhost:5000/api/analytics/visitors?page=1&limit=10"

# Today only
curl "http://localhost:5000/api/analytics/visitors?page=1&limit=10&filter=today"

# Last 7 days
curl "http://localhost:5000/api/analytics/visitors?page=1&limit=10&filter=7days"
```

## Real-Time Updates (Socket.IO)

Connect your frontend or admin dashboard to the server URL.

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// Live update on every track request
socket.on("visitorUpdate", (data) => {
  console.log(data.activeCount, data.activeVisitors);
});

// Request full dashboard snapshot
socket.emit("requestRealtimeData");
socket.on("realtimeData", (data) => {
  console.log(data);
});
```

| Event                | Direction      | Description                        |
| -------------------- | -------------- | ---------------------------------- |
| `visitorUpdate`      | Server → Client | Active visitors after each track  |
| `requestRealtimeData`| Client → Server | Request full real-time snapshot   |
| `realtimeData`       | Server → Client | Dashboard data response           |

## Postman Collection

Import the collection for testing all APIs:

```
postman/Portfolio-Analytics-API.postman_collection.json
```

In Postman: **File → Import → Upload Files**

## License

ISC
