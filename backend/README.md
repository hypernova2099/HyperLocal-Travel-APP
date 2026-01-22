# Smart District Travel Assistant Backend (Part 1)

Node.js + Express + MongoDB backend powering the Smart District Travel Assistant mobile app.

## Stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT auth (bcryptjs + jsonwebtoken)

## Prerequisites
- Node.js 18+
- MongoDB running locally or a connection string

## Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart_district
JWT_SECRET=supersecretkey
```

## Run the server
```bash
npm start
```
The server starts on `http://localhost:5000`.

For development with auto-reload:
```bash
npm run dev
```

## Seed sample data
```bash
npm run seed
```
Seeds:
- Bus routes, private buses, metro sample
- Places (food/attraction/activity)
- Taxi drivers

## API Mounts
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/trip/plan`
- `GET /api/bus/private-options`
- `GET /api/bus/routes/:routeId`
- `GET /api/places`
- `GET /api/places/along-route`
- `GET /api/taxis`
- `POST /api/dayplan` (auth)
- `GET /api/dayplan/my` (auth)

## Project Structure
```
backend/
  src/
    index.js
    config/db.js
    middleware/auth.js
    utils/geo.js
    models/
    controllers/
    routes/
    seed.js
```
