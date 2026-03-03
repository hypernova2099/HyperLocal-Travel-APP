## PROJECT FILE DOCUMENTATION

This document provides **file-by-file technical documentation** for the entire repository, covering:
- **Frontend**: React Native (Expo) app under `src/` plus project root entry/config files.
- **Backend**: Node.js + Express + MongoDB (Mongoose) app under `backend/`.

For each file, you’ll find:
- **Purpose**: What it does
- **Why it exists**: The role it plays in the system
- **System area**: Which subsystem it belongs to (auth, navigation, live tracking, booking, etc.)
- **Who depends on it**: Callers/importers (where applicable)
- **Key interactions**: APIs/models/components it calls or is called by

---

## PROJECT ROOT (FRONTEND ENTRY + CONFIG)

### `/package.json`
- **Purpose**: Defines the Expo app’s npm package metadata, scripts, and runtime dependencies.
- **Why it exists**: Drives dependency installation and standard run commands for development.
- **System area**: Frontend build/runtime (Expo + React Native).
- **Who depends on it**: All tooling (`npm`, Expo CLI), the entire JS runtime.
- **Key interactions**:
  - **Scripts**: `expo start` plus platform shortcuts.
  - **Dependencies**: `@react-navigation/*`, `axios`, `expo-location`, `react-native-maps`, AsyncStorage, vector icons.

### `/package-lock.json`
- **Purpose**: Lockfile pinning exact dependency versions/resolutions.
- **Why it exists**: Ensures reproducible installs across machines/CI.
- **System area**: Tooling/dependency management.
- **Who depends on it**: `npm install`.
- **Key interactions**: Mirrors dependencies declared in `/package.json`.

### `/app.json`
- **Purpose**: Expo app configuration (name, slug, platform settings, permissions).
- **Why it exists**: Controls native build settings and permissions without editing native projects.
- **System area**: Expo config, platform permissions.
- **Who depends on it**: Expo runtime/build process.
- **Key interactions**:
  - **Location permissions**: iOS `NSLocationWhenInUseUsageDescription`; Android `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`.
  - **Assets references**: icon/splash/adaptive icons (paths referenced here must exist for builds).

### `/App.js`
- **Purpose**: Root React component for the Expo app.
- **Why it exists**: Composes global providers and the root navigation container.
- **System area**: Frontend composition/entry.
- **Who depends on it**: `/index.js` (registered root component).
- **Key interactions**:
  - Wraps app in `AuthProvider` (`src/context/AuthContext.js`).
  - Renders `RootNavigator` (`src/navigation/RootNavigator.js`).

### `/index.js`
- **Purpose**: Expo entrypoint that registers the `App` component.
- **Why it exists**: Standard Expo bootstrap so the app can run in Expo Go and native builds.
- **System area**: Frontend bootstrap.
- **Who depends on it**: Expo runtime.
- **Key interactions**:
  - `registerRootComponent(App)` from `expo`.

### `/.gitignore`
- **Purpose**: Prevents committing build artifacts, node_modules, Expo caches, and native folders.
- **Why it exists**: Keeps the repository clean and reproducible.
- **System area**: Repo hygiene.
- **Who depends on it**: Git.
- **Key interactions**:
  - Ignores `.expo/`, `node_modules/`, generated `ios/` and `android/` folders, etc.

### `/ISSUES.md`
- **Purpose**: Repository documentation file (this file).
- **Why it exists**: Centralized technical documentation for onboarding and maintenance.
- **System area**: Documentation.
- **Who depends on it**: Humans (developers/maintainers).
- **Key interactions**: None (no runtime imports).

---

## BACKEND (`/backend`)

### `/backend/package.json`
- **Purpose**: Backend service package metadata, scripts, and dependencies.
- **Why it exists**: Defines how to run the Express server and seed the database.
- **Key responsibilities**:
  - `start`: `node src/index.js`
  - `dev`: `nodemon src/index.js`
  - `seed`: `node src/seed.js`
- **System area**: Backend runtime/tooling.
- **Connected to**: Express, Mongoose, JWT auth libraries, request logging (`morgan`).

### `/backend/package-lock.json`
- **Purpose**: Backend lockfile for reproducible dependency installation.
- **Why it exists**: Ensures consistent versions for Express/Mongoose/etc.
- **System area**: Tooling/dependency management.
- **Connected to**: `/backend/package.json`.

### `/backend/README.md`
- **Purpose**: Backend setup and usage documentation.
- **Why it exists**: Provides installation, environment setup, seed instructions, and credential info.
- **System area**: Documentation.
- **Connected to**:
  - Backend scripts (`npm run seed`, `npm start`)
  - Documented API mounts and test credentials.

### `/backend/.gitignore`
- **Purpose**: Backend-specific ignore rules.
- **Why it exists**: Prevents committing secrets (`.env`).
- **System area**: Repo hygiene.
- **Connected to**: Git.

---

## BACKEND SOURCE (`/backend/src`)

### `/backend/src/index.js`
- **Purpose**: Express server entrypoint and API router registration.
- **Why it exists**: Central place to configure middleware, connect to MongoDB, and mount all `/api/*` routes.
- **System area**: Backend runtime, routing.
- **Who depends on it**: `npm start`, `npm run dev` scripts.
- **Key responsibilities**:
  - Loads env (`dotenv`), creates Express app.
  - Middleware: `cors`, `express.json`, `morgan`.
  - Health check at `/`.
  - Mounts:
    - `/api/auth`, `/api/trip`, `/api/bus`, `/api/places`, `/api/taxis`, `/api/dayplan`
    - `/api/driver`, `/api/admin`, `/api/live`, `/api/emergency`, `/api/booking`
  - Connects DB via `connectDB` and starts server.
- **Connected to**:
  - `config/db.js`
  - all route modules under `routes/`.

### `/backend/src/config/db.js`
- **Purpose**: MongoDB connection helper using Mongoose.
- **Why it exists**: Encapsulates connection logic and error handling.
- **System area**: Database.
- **Who depends on it**: `src/index.js`, `src/seed.js`.
- **Key responsibilities**:
  - `mongoose.connect(mongoUri, ...)`
  - process exit on fatal connection failure.

---

## BACKEND MIDDLEWARE (`/backend/src/middleware`)

### `/backend/src/middleware/auth.js`
- **Purpose**: JWT authentication middleware (`authRequired`).
- **Why it exists**: Protects routes that require authentication.
- **System area**: Auth/security.
- **Who depends on it**:
  - Routes: `dayplan.js`, `driver.js`, `admin.js`, `live.js`, `booking.js` (and any others requiring auth).
- **Key responsibilities**:
  - Reads `Authorization: Bearer <token>`.
  - Verifies token with `JWT_SECRET`.
  - Attaches `req.user = { userId, role }`.
  - Returns `401` on missing/invalid token.
- **Connected to**: `jsonwebtoken`, environment variable `JWT_SECRET`.

### `/backend/src/middleware/roles.js`
- **Purpose**: Role-based access control middleware (`adminOnly`, `driverOnly`, `userOnly`).
- **Why it exists**: Enforces system roles: **admin**, **driver**, **user**.
- **System area**: Auth/security (RBAC).
- **Who depends on it**:
  - `routes/admin.js` uses `adminOnly`.
  - `routes/live.js` uses `driverOnly` for updates.
  - `routes/driver.js` uses `driverOnly` for assigned bus.
  - `routes/booking.js` uses `userOnly`.
- **Key responsibilities**:
  - `adminOnly`: checks `req.user.role === 'admin'`.
  - `driverOnly`: reloads latest `User` from DB to verify role and attach `assignedBus` into `req.user`.
  - `userOnly`: checks `req.user.role === 'user'`.
- **Connected to**: `models/User.js` (DB check in `driverOnly`).

---

## BACKEND UTILS (`/backend/src/utils`)

### `/backend/src/utils/geo.js`
- **Purpose**: Geographic helper functions for route distance and proximity checks.
- **Why it exists**: Centralizes shared geospatial logic used across trip planning and fares.
- **System area**: Trip planning, fare calculation, discovery.
- **Who depends on it**:
  - `controllers/tripController.js`
  - `utils/fare.js` (via `distanceAlongStops`)
- **Key responsibilities**:
  - `haversineKm(a, b)`: distance between points.
  - `distanceAlongStops(stops, startIdx, endIdx)`: cumulative stop distance.
  - `isPlaceNearStops(place, stops, thresholdKm)`: proximity filter.
- **Connected to**: `models/BusRoute.js` stop coordinates and `models/Place.js` lat/lng.

### `/backend/src/utils/fare.js`
- **Purpose**: Unified fare computation for bookings and bus options.
- **Why it exists**: Ensures **consistent fare logic** across endpoints.
- **System area**: Fare calculation.
- **Who depends on it**:
  - `controllers/busController.js` (private options)
  - `controllers/bookingController.js` (booking fare)
- **Key responsibilities**:
  - `calculateFare(bus, route, fromStop, toStop)`:
    - Finds stop indices in `route.stops`.
    - Computes segment distance with `distanceAlongStops`.
    - Calculates `round(baseFare + farePerKm * distanceKm)` with reasonable fallbacks.
- **Connected to**:
  - `utils/geo.js`
  - `models/Bus.js` pricing fields.
  - `models/BusRoute.js` stops.

---

## BACKEND MODELS (`/backend/src/models`)

### `/backend/src/models/User.js`
- **Purpose**: Stores users (passengers), drivers, and admins.
- **Why it exists**: Central identity and role store for JWT auth and RBAC.
- **System area**: Auth, roles, driver assignment.
- **Schema explanation**:
  - `name`, `email (unique)`, `passwordHash`
  - `role`: `'user' | 'driver' | 'admin'` (default `'user'`)
  - `assignedBus`: `ObjectId` ref `Bus` (drivers only; used for live updates)
  - `createdAt`
- **Where it is used**:
  - `controllers/authController.js` (register/login)
  - `middleware/roles.js` (driverOnly loads role/assignedBus)
  - `controllers/adminController.js` (promote user to driver + assign bus)
  - `controllers/driverController.js` (fetch assigned bus)

### `/backend/src/models/BusRoute.js`
- **Purpose**: Represents a transport route with stops and polyline.
- **Why it exists**: Foundation for trip planning, route display, and fare segment calculations.
- **System area**: Routes/trip planning.
- **Schema explanation**:
  - `name`, `from`, `to`
  - `stops[]`: `{ name, lat, lng }`
  - `polyline`: `[[lat, lng], ...]`
- **Where it is used**:
  - `controllers/tripController.js` (match routes by from/to)
  - `controllers/busController.js` (route lookup for private options and route details)
  - `controllers/placesController.js` (along-route proximity)
  - `controllers/driverController.js` (validate routeId on driver apply)
  - `utils/fare.js` (stop distance)

### `/backend/src/models/Bus.js`
- **Purpose**: Represents a specific bus/operator instance on a route.
- **Why it exists**: Separates route geometry from operator frequency and pricing.
- **System area**: Bus options, live tracking association, fares.
- **Schema explanation**:
  - `routeId` ref `BusRoute`
  - `name`, `operatorType` (`private|ksrtc|metro`)
  - `frequencyMinutes`, `approxDurationMinutes`
  - `baseFare`, `farePerKm`
- **Where it is used**:
  - `controllers/tripController.js` (private/metro availability, fare estimates)
  - `controllers/busController.js` (private options by route)
  - `controllers/adminController.js` (assign a bus to approved driver)
  - `controllers/bookingController.js` (validate bus + pricing)
  - `models/LiveLocation.js` references `busId`

### `/backend/src/models/Place.js`
- **Purpose**: Stores POIs for discovery and emergency points.
- **Why it exists**: Powers Explore, route-based discovery, and Safety features.
- **System area**: Discovery & safety.
- **Schema explanation**:
  - `name`
  - `type`: `food|activity|attraction|emergency`
  - `subtype` (e.g., hospital/police/fire)
  - `lat`, `lng`, `area`, `rating`, `priceLevel`, `isOpenNow`
- **Where it is used**:
  - `controllers/placesController.js`
  - `controllers/tripController.js` (placesAlongRoute)
  - `controllers/emergencyController.js` (emergency type filter)
  - `controllers/dayPlanController.js` (select itinerary places)

### `/backend/src/models/TaxiDriver.js`
- **Purpose**: Stores verified taxi driver listings.
- **Why it exists**: Powers Taxi/verified drivers screen.
- **System area**: Taxi feature.
- **Schema explanation**:
  - `name`, `phone`, `vehicle`, `area`, `rating`, `languages[]`
- **Where it is used**:
  - `controllers/taxiController.js`
  - `seed.js` inserts sample drivers.

### `/backend/src/models/DayPlan.js`
- **Purpose**: Stores generated day itineraries per user.
- **Why it exists**: Persists day plan results so users can fetch past plans.
- **System area**: Day Planner.
- **Schema explanation**:
  - `userId` ref `User`
  - `duration`: `"half"|"full"`
  - `interests[]`
  - `items[]`: `{ time, title, type }`
  - `createdAt`
- **Where it is used**:
  - `controllers/dayPlanController.js` create/list.

### `/backend/src/models/DriverRequest.js`
- **Purpose**: Stores driver verification/applications.
- **Why it exists**: Supports user-to-driver application flow + admin approval.
- **System area**: Driver verification.
- **Schema explanation**:
  - `userId` ref `User`
  - `busNumber`, `operatorName`, `licenseNumber`
  - `routeId` ref `BusRoute`
  - `status`: `pending|approved|rejected` (default pending)
  - `createdAt`
- **Where it is used**:
  - `controllers/driverController.js` (apply)
  - `controllers/adminController.js` (approve/reject + filtering)
  - `seed.js` inserts a pending request.

### `/backend/src/models/LiveLocation.js`
- **Purpose**: Stores the last known live GPS location for a bus.
- **Why it exists**: Enables real-time passenger tracking by polling.
- **System area**: Live tracking.
- **Schema explanation**:
  - `busId` ref `Bus`
  - `lat`, `lng`
  - `speed`, `heading`
  - `lastUpdated` timestamp
- **Where it is used**:
  - `controllers/liveController.js` (upsert updates + fetch)
  - `seed.js` creates an initial location record.

### `/backend/src/models/Booking.js`
- **Purpose**: Stores ticket bookings for a user and bus segment.
- **Why it exists**: Persists bookings created from the passenger flow.
- **System area**: Booking.
- **Schema explanation**:
  - `userId` ref `User`
  - `busId` ref `Bus`
  - `routeId` ref `BusRoute`
  - `fromStop`, `toStop`
  - `fare` (computed server-side)
  - `status`: `booked|cancelled` (default booked)
  - `createdAt`
- **Where it is used**:
  - `controllers/bookingController.js` (create booking)

---

## BACKEND CONTROLLERS (`/backend/src/controllers`)

### `/backend/src/controllers/authController.js`
- **Purpose**: Implements `POST /api/auth/register` and `POST /api/auth/login`.
- **Why it exists**: Centralizes auth logic and JWT issuance.
- **System area**: Authentication.
- **Who depends on it**: `routes/auth.js`.
- **Key responsibilities**:
  - Registration:
    - validates required fields
    - rejects duplicate email
    - hashes password with `bcryptjs`
    - creates user with default `role: 'user'`
  - Login:
    - validates credentials
    - signs JWT with `{ userId, role }` expiring in 7 days
    - returns `{ token, user: {_id, name, email, role} }`
- **Connected to**: `models/User.js`, `middleware/auth.js` (consumer of JWT).

### `/backend/src/controllers/tripController.js`
- **Purpose**: Implements `POST /api/trip/plan`.
- **Why it exists**: Builds route options (private-bus/auto/metro) and attaches places along route.
- **System area**: Trip planning.
- **Who depends on it**: `routes/trip.js`.
- **Key responsibilities**:
  - Loosely matches a `BusRoute` by `from/to` regex (and reverse).
  - Loads buses on the route to decide:
    - include private-bus only if private buses exist
    - include metro only if metro buses exist
    - always include auto option
  - Computes:
    - durations (from bus approxDurationMinutes or heuristics)
    - fare estimates (base + per-km * route distance)
  - Finds places along route by filtering `Place` near stops using `isPlaceNearStops`.
- **Connected to**:
  - `models/BusRoute.js`, `models/Bus.js`, `models/Place.js`
  - `utils/geo.js`

### `/backend/src/controllers/busController.js`
- **Purpose**: Implements bus-related endpoints:
  - `GET /api/bus/private-options`
  - `GET /api/bus/route/:routeId`
  - `GET /api/bus/:busId`
- **Why it exists**: Provides bus listings and route geometry to the app.
- **System area**: Bus & routes, live tracking support.
- **Who depends on it**: `routes/bus.js`.
- **Key responsibilities**:
  - Private options:
    - validates `routeId`, loads `BusRoute`
    - finds private buses for the route
    - computes **segment fare** for each bus using `calculateFare`
  - Route details:
    - returns route document including `stops` and `polyline`
  - Bus by id:
    - returns bus document (includes `routeId` used by frontend to fetch route).
- **Connected to**:
  - `models/BusRoute.js`, `models/Bus.js`
  - `utils/fare.js`

### `/backend/src/controllers/placesController.js`
- **Purpose**: Implements:
  - `GET /api/places`
  - `GET /api/places/along-route`
- **Why it exists**: Powers Explore and route-based discovery.
- **System area**: Places/discovery.
- **Who depends on it**: `routes/places.js`.
- **Key responsibilities**:
  - `getPlaces`: optional `type` filtering.
  - `getPlacesAlongRoute`: requires `routeId` + `type`, then proximity-filters places near route stops.
- **Connected to**: `models/Place.js`, `models/BusRoute.js`, `utils/geo.js`.

### `/backend/src/controllers/taxiController.js`
- **Purpose**: Implements `GET /api/taxis`.
- **Why it exists**: Provides taxi driver listing for Taxi screen.
- **System area**: Taxi.
- **Who depends on it**: `routes/taxis.js`.
- **Key responsibilities**: Returns all `TaxiDriver` documents.
- **Connected to**: `models/TaxiDriver.js`.

### `/backend/src/controllers/dayPlanController.js`
- **Purpose**: Implements:
  - `POST /api/dayplan` (auth)
  - `GET /api/dayplan/my` (auth)
- **Why it exists**: Generates and stores day itineraries.
- **System area**: Day Planner.
- **Who depends on it**: `routes/dayplan.js`.
- **Key responsibilities**:
  - Converts interests → place types (food/activity/attraction).
  - Builds a simple timeline `items[]`.
  - Persists `DayPlan` for the authenticated user.
  - Returns plans sorted by `createdAt` on `/my`.
- **Connected to**:
  - `models/DayPlan.js`, `models/Place.js`
  - `middleware/auth.js` (for `req.user.userId`).

### `/backend/src/controllers/driverController.js`
- **Purpose**: Implements driver-side endpoints:
  - `POST /api/driver/apply`
  - `GET /api/driver/assigned-bus`
- **Why it exists**: Enables driver verification workflow and driver dashboard bus info.
- **System area**: Driver verification, driver mode.
- **Who depends on it**: `routes/driver.js`.
- **Key responsibilities**:
  - Apply:
    - validates fields
    - validates `routeId` exists
    - creates `DriverRequest` with default `pending`
    - returns `{ message, requestId }`
  - Assigned bus:
    - reads the authenticated driver’s `assignedBus`
    - returns `Bus` document or 404.
- **Connected to**:
  - `models/DriverRequest.js`, `models/User.js`, `models/Bus.js`, `models/BusRoute.js`
  - `middleware/auth.js`, `middleware/roles.js`.

### `/backend/src/controllers/adminController.js`
- **Purpose**: Implements admin-only driver request management:
  - `GET /api/admin/driver-requests`
  - `POST /api/admin/approve-driver`
  - `POST /api/admin/reject-driver`
- **Why it exists**: Centralizes approval workflow and driver role changes.
- **System area**: Admin tools, driver verification.
- **Who depends on it**: `routes/admin.js`.
- **Key responsibilities**:
  - Lists **only pending** requests and populates user info.
  - Approve:
    - checks request is pending
    - finds a bus for the requested route
    - sets `User.role = 'driver'` and `User.assignedBus = bus._id`
    - sets request status to `approved`
  - Reject:
    - checks pending
    - sets status to `rejected`
- **Connected to**: `models/DriverRequest.js`, `models/User.js`, `models/Bus.js`.

### `/backend/src/controllers/liveController.js`
- **Purpose**: Implements live bus tracking:
  - `POST /api/live/update` (driver-only)
  - `GET /api/live/:busId` (public)
- **Why it exists**: Stores and serves real-time bus location.
- **System area**: Live tracking.
- **Who depends on it**: `routes/live.js`.
- **Key responsibilities**:
  - Update:
    - derives `busId` from authenticated driver’s `assignedBus`
    - upserts a `LiveLocation` document keyed by `busId`
    - sets `lastUpdated: new Date()`
  - Get:
    - returns latest location for requested busId or 404.
- **Connected to**:
  - `models/LiveLocation.js`
  - `middleware/roles.js` driverOnly for assignedBus injection.

### `/backend/src/controllers/emergencyController.js`
- **Purpose**: Implements `GET /api/emergency`.
- **Why it exists**: Provides emergency places used by the Safety screen.
- **System area**: Safety.
- **Who depends on it**: `routes/emergency.js`.
- **Key responsibilities**: Returns all `Place` documents where `type: 'emergency'`.
- **Connected to**: `models/Place.js`.

### `/backend/src/controllers/bookingController.js`
- **Purpose**: Implements `POST /api/booking` (user-only).
- **Why it exists**: Creates bookings tied to a bus, route, and stop segment.
- **System area**: Booking.
- **Who depends on it**: `routes/booking.js`.
- **Key responsibilities**:
  - Validates required body fields.
  - Validates bus exists.
  - Validates route exists.
  - Validates bus belongs to the route (`bus.routeId.toString() === routeId`).
  - Computes fare using `calculateFare(bus, route, fromStop, toStop)`.
  - Creates and returns `Booking`.
- **Connected to**:
  - `models/Booking.js`, `models/Bus.js`, `models/BusRoute.js`
  - `utils/fare.js`
  - `middleware/auth.js`, `middleware/roles.js` (userOnly).

---

## BACKEND ROUTES (`/backend/src/routes`)

### `/backend/src/routes/auth.js`
- **Purpose**: Mounts auth endpoints under `/api/auth`.
- **Why it exists**: Keeps routing separate from controller logic.
- **System area**: Auth.
- **Connected to**: `controllers/authController.js`.
- **Exports**: Express `router` with:
  - `POST /register`
  - `POST /login`

### `/backend/src/routes/trip.js`
- **Purpose**: Mounts trip planning under `/api/trip`.
- **System area**: Trip planning.
- **Connected to**: `controllers/tripController.js`.
- **Exports**:
  - `POST /plan`

### `/backend/src/routes/bus.js`
- **Purpose**: Mounts bus and route endpoints under `/api/bus`.
- **System area**: Bus/route info for trip planning + live tracking map context.
- **Connected to**: `controllers/busController.js`.
- **Exports**:
  - `GET /private-options`
  - `GET /route/:routeId`
  - `GET /:busId`

### `/backend/src/routes/places.js`
- **Purpose**: Mounts place discovery endpoints under `/api/places`.
- **System area**: Discovery.
- **Connected to**: `controllers/placesController.js`.
- **Exports**:
  - `GET /`
  - `GET /along-route`

### `/backend/src/routes/taxis.js`
- **Purpose**: Mounts taxi listing under `/api/taxis`.
- **System area**: Taxi.
- **Connected to**: `controllers/taxiController.js`.
- **Exports**:
  - `GET /`

### `/backend/src/routes/dayplan.js`
- **Purpose**: Mounts day plan endpoints under `/api/dayplan`.
- **System area**: Day planner.
- **Connected to**:
  - `middleware/auth.js` (protects both endpoints)
  - `controllers/dayPlanController.js`
- **Exports**:
  - `POST /` (create)
  - `GET /my` (list user’s plans)

### `/backend/src/routes/driver.js`
- **Purpose**: Mounts driver workflow endpoints under `/api/driver`.
- **System area**: Driver verification and driver dashboard.
- **Connected to**:
  - `middleware/auth.js`
  - `middleware/roles.js` (`driverOnly` for assigned-bus)
  - `controllers/driverController.js`
- **Exports**:
  - `POST /apply` (authRequired)
  - `GET /assigned-bus` (authRequired + driverOnly)

### `/backend/src/routes/admin.js`
- **Purpose**: Mounts admin-only endpoints under `/api/admin`.
- **System area**: Admin approval flow.
- **Connected to**:
  - `middleware/auth.js`
  - `middleware/roles.js` (`adminOnly`)
  - `controllers/adminController.js`
- **Exports**:
  - `GET /driver-requests`
  - `POST /approve-driver`
  - `POST /reject-driver`

### `/backend/src/routes/live.js`
- **Purpose**: Mounts live tracking endpoints under `/api/live`.
- **System area**: Live tracking.
- **Connected to**:
  - `middleware/auth.js`
  - `middleware/roles.js` (`driverOnly` for updates)
  - `controllers/liveController.js`
- **Exports**:
  - `POST /update` (driver-only)
  - `GET /:busId` (public)

### `/backend/src/routes/emergency.js`
- **Purpose**: Mounts emergency endpoints under `/api/emergency`.
- **System area**: Safety.
- **Connected to**: `controllers/emergencyController.js`.
- **Exports**:
  - `GET /`

### `/backend/src/routes/booking.js`
- **Purpose**: Mounts booking creation under `/api/booking`.
- **System area**: Booking.
- **Connected to**:
  - `middleware/auth.js`
  - `middleware/roles.js` (`userOnly`)
  - `controllers/bookingController.js`
- **Exports**:
  - `POST /` (user-only)

---

## BACKEND SEEDING (`/backend/src/seed.js`)
- **Purpose**: One-off script to populate MongoDB with working sample data.
- **Why it exists**: Enables immediate local testing without manual DB setup.
- **System area**: Tooling / sample data.
- **Who depends on it**:
  - `npm run seed` (backend script)
  - Frontend flows that assume routes/buses/users exist.
- **Key responsibilities**:
  - Clears collections (routes, buses, places, taxis, users, driver requests, live locations).
  - Inserts:
    - `BusRoute` sample routes with stops/polyline.
    - `Bus` sample buses (private/metro) tied to routes.
    - `Place` sample food/activity/attraction + emergency places.
    - `TaxiDriver` sample taxi drivers.
    - Users: admin, drivers (with assignedBus), normal user.
    - One pending `DriverRequest` for the normal user.
    - One initial `LiveLocation` for a driver’s assigned bus.
- **Connected to**:
  - `config/db.js`
  - all model files under `models/`.

---

## FRONTEND (`/src`)

## FRONTEND API LAYER (`/src/api`)

### `/src/api/apiClient.js`
- **Purpose**: Central Axios client configured for the backend.
- **Why it exists**: Enforces consistent baseURL, headers, timeout, and auth behavior across all API calls.
- **System area**: Networking/auth integration.
- **Who depends on it**: `src/api/services.js` and any screen directly using `apiClient`.
- **Key responsibilities**:
  - Sets `baseURL` to a LAN backend URL (config constant).
  - Request interceptor:
    - Reads JWT from `AsyncStorage` and attaches `Authorization: Bearer <token>`.
  - Response interceptor:
    - On `401`, clears storage and emits unauthorized event.
    - Wraps and rethrows errors with `userMessage`.
- **Connected to**:
  - `AsyncStorage`
  - `src/api/authEvents.js`

### `/src/api/authEvents.js`
- **Purpose**: Lightweight pub/sub channel for global unauthorized handling.
- **Why it exists**: Prevents importing navigation into API layer; decouples 401 detection from UI.
- **System area**: Auth/session management.
- **Who depends on it**:
  - `apiClient.js` emits via `emitUnauthorized()`.
  - `AuthContext.js` subscribes via `onUnauthorized(...)`.
- **Key responsibilities**:
  - Manage listener set.
  - Broadcast unauthorized event safely (try/catch per listener).

### `/src/api/services.js`
- **Purpose**: Typed-by-convention API service wrapper functions for app features.
- **Why it exists**: Centralizes endpoints and keeps screens simpler/consistent.
- **System area**: Networking/services.
- **Who depends on it**: Many screens (`PlanTrip`, `Explore`, `Safety`, `Taxi`, `DayPlan`, driver screens, live tracking, booking).
- **Key responsibilities**:
  - `authService`: `/auth/register`, `/auth/login`
  - `busService`: `/bus/search` (if implemented), `/bus/routes/:routeId`, `/live/:busId`
  - `placesService`: `/places`, `/places/along-route`
  - `safetyService`: `/emergency`
  - `taxiService`: `/taxis`
  - `dayPlanService`: `/dayplan`, `/dayplan/my`
  - `tripService`: `/trip/plan`, `/bus/private-options`
  - `driverService`: `/driver/apply`, `/driver/assigned-bus`
  - `liveService`: `/live/update` (driver GPS updates)
  - `bookingService`: `/booking` (create booking)
- **Connected to**:
  - `apiClient.js`
  - Backend route structure under `/api/*`.

---

## FRONTEND CONTEXT (`/src/context`)

### `/src/context/AuthContext.js`
- **Purpose**: Global auth state store (user, token, loading) and auth actions.
- **Why it exists**: Provides login/register/logout and persisted session restore for the entire app.
- **System area**: Auth/session, role-based routing.
- **Who depends on it**:
  - `App.js` wraps app in `AuthProvider`.
  - `RootNavigator.js` reads `isAuthenticated`, `loading`, `user.role`.
  - Many screens read `user` and call `logout()`.
- **Key responsibilities**:
  - On mount:
    - restore `token` and `user` from `AsyncStorage`.
    - subscribe to unauthorized events to auto-logout.
  - `login(email, password)`:
    - calls `authService.login`
    - stores token/user in `AsyncStorage`
  - `register(name, email, password)`:
    - calls `authService.register`
  - `logout()`:
    - clears auth storage and resets state.
- **Connected to**:
  - `src/api/services.js` (authService)
  - `src/api/authEvents.js`
  - `AsyncStorage`

---

## FRONTEND NAVIGATION (`/src/navigation`)

### `/src/navigation/RootNavigator.js`
- **Purpose**: Top-level role-based navigator switch.
- **Why it exists**: Ensures admins/drivers/users see different navigation trees.
- **System area**: Navigation, RBAC UX.
- **Who depends on it**: Rendered by `/App.js`.
- **Key responsibilities**:
  - Shows loading indicator while auth restores.
  - If authenticated:
    - `admin` → `AdminNavigator`
    - `driver` → `DriverStack`
    - otherwise → `AppNavigator`
  - If unauthenticated → `AuthNavigator`
- **Connected to**: `AuthContext`, all navigator files below.

### `/src/navigation/AuthNavigator.js`
- **Purpose**: Authentication stack navigator.
- **Why it exists**: Contains login and registration screens.
- **System area**: Navigation (Auth flow).
- **Who depends on it**: `RootNavigator`.
- **Connected to**: `LoginScreen`, `RegisterScreen`.

### `/src/navigation/AppNavigator.js`
- **Purpose**: Main user (passenger) tab navigator with nested feature stacks.
- **Why it exists**: Provides the primary “user mode” UI with tabs and a Home stack that contains flows.
- **System area**: Navigation (user flow).
- **Who depends on it**: `RootNavigator` for non-driver, non-admin users.
- **Key responsibilities**:
  - Bottom tabs: Home, Explore, Safety, Taxis, DayPlan, Profile.
  - Home stack contains:
    - `PlanTrip → RouteOptions → PrivateBusOptions → LiveTracking → BookingConfirmation`
    - plus placeholders for BusSearch/Explore/Safety/Taxis/DayPlan screens accessible from tiles.
  - Profile stack contains `DriverApply`.
- **Connected to**: All listed screens.

### `/src/navigation/DriverStack.js`
- **Purpose**: Driver-only navigation stack.
- **Why it exists**: Prevents drivers from seeing passenger tabs; keeps driver mode minimal.
- **System area**: Navigation (driver flow).
- **Who depends on it**: `RootNavigator` when `user.role === 'driver'`.
- **Connected to**: `DriverDashboardScreen`.

### `/src/navigation/AdminNavigator.js`
- **Purpose**: Admin-only navigation stack.
- **Why it exists**: Provides admin dashboard entry and isolates it from user UI.
- **System area**: Navigation (admin flow).
- **Who depends on it**: `RootNavigator` when `user.role === 'admin'`.
- **Connected to**: `AdminDashboardScreen`.

---

## FRONTEND THEME (`/src/theme`)

### `/src/theme/colors.js`
- **Purpose**: Central color palette.
- **Why it exists**: Ensures consistent UI styling across components/screens.
- **System area**: UI theme.
- **Who depends on it**: Most UI files (screens/components).
- **Key responsibilities**:
  - Defines primary colors, background colors, text colors, card colors, status colors, emergency colors, shadow color.

### `/src/theme/spacing.js`
- **Purpose**: Central spacing and border-radius constants.
- **Why it exists**: Consistent layout rhythm and corner radii across the app.
- **System area**: UI theme.
- **Who depends on it**: Most UI files.
- **Key responsibilities**:
  - `spacing`: xs→xxl scale
  - `borderRadius`: sm→xl + full pill radius

---

## FRONTEND COMPONENTS (`/src/components`)

### `/src/components/IconTileButton.js`
- **Purpose**: Reusable square/rounded tile used on Home screen grid.
- **Why it exists**: Encapsulates consistent tile styling + icon rendering.
- **System area**: UI components.
- **Who depends on it**: `HomeScreen`.
- **Key interactions**:
  - Uses `Ionicons`, `colors`, `spacing`.
  - Calls `onPress` passed by parent.

### `/src/components/SectionHeader.js`
- **Purpose**: Section header row with title/subtitle and optional right-side content.
- **Why it exists**: Keeps headings consistent across screens.
- **System area**: UI components.
- **Who depends on it**: `HomeScreen` (and potentially others).
- **Key interactions**: Pure presentational component.

### `/src/components/RouteOptionCard.js`
- **Purpose**: Card UI for a route option (bus/metro/auto) with duration/fare/frequency.
- **Why it exists**: Encapsulates route-option card styling for reuse.
- **System area**: UI components (transport options).
- **Who depends on it**: Potentially route option screens/flows (varies by implementation usage).
- **Key interactions**:
  - Interprets `route.mode` and optional `route.frequency`.
  - Calls `onPress`.

### `/src/components/TimelineStopItem.js`
- **Purpose**: Timeline row for route stops / itinerary items with status icon + connecting line.
- **Why it exists**: Shared timeline rendering for LiveTracking legacy stop list and DayPlan.
- **System area**: UI components (timeline).
- **Who depends on it**: `LiveTrackingScreen` (legacy mode), `DayPlanScreen`.
- **Key interactions**:
  - Renders different icon names/colors for `isCompleted`, `isActive`.

### `/src/components/PlaceCard.js`
- **Purpose**: Displays a place with image/placeholder, name, area, rating, and distance.
- **Why it exists**: Shared card UI for places in Explore and recommendations.
- **System area**: UI components (places).
- **Who depends on it**: `ExploreScreen`, `HomeScreen`, `RouteOptionsScreen` (placesAlongRoute).
- **Key interactions**:
  - Uses optional `place.image` (URL).
  - Assumes `place.distance` exists for distance formatting; screens should provide it or accept `undefined` display quirks.

### `/src/components/EmergencyCard.js`
- **Purpose**: Renders emergency point row with icon color-coding and call-to-action.
- **Why it exists**: Standardizes Safety screen listing.
- **System area**: UI components (safety).
- **Who depends on it**: `SafetyScreen`.
- **Key interactions**:
  - Uses `emergency.phone` and either `onCall` callback or `Linking.openURL('tel:...')`.
  - Icon selection/color depends on `emergency.type` (note: backend uses `Place.type='emergency'` and `subtype` for police/fire/hospital; the Safety screen groups into arrays but passes through original object).

---

## FRONTEND SCREENS (`/src/screens`)

### `/src/screens/LoginScreen.js`
- **Purpose**: Login UI and submission handler.
- **Why it exists**: Entry point for unauthenticated users.
- **System area**: Auth UI.
- **Who depends on it**: `AuthNavigator`.
- **Key responsibilities**:
  - Collects email/password.
  - Calls `AuthContext.login`.
  - Shows alert on failure; success transitions via role-based RootNavigator state changes.
- **Connected to**: `AuthContext`, theme constants.

### `/src/screens/RegisterScreen.js`
- **Purpose**: Registration UI and submission handler.
- **Why it exists**: Allows new user signup.
- **System area**: Auth UI.
- **Who depends on it**: `AuthNavigator`.
- **Key responsibilities**:
  - Validates fields (including password confirmation).
  - Calls `authService.register` directly (not via AuthContext).
  - On success navigates back to Login.
- **Connected to**: `src/api/services.js` (authService).

### `/src/screens/HomeScreen.js`
- **Purpose**: Main landing screen for passenger “user” mode.
- **Why it exists**: Provides quick access tiles into app features.
- **System area**: Passenger UX.
- **Who depends on it**: `AppNavigator` (Home stack).
- **Key responsibilities**:
  - Renders header “Welcome back” card with city.
  - Renders tile grid that navigates to screens like PlanTrip, BusSearch, Explore (filtered), Safety, Taxis, DayPlan.
  - Renders a static “Recommended for you” list.
- **Connected to**: `IconTileButton`, `SectionHeader`, `PlaceCard`, navigation.

### `/src/screens/PlanTripScreen.js`
- **Purpose**: Trip planning input UI (From fixed, To user input).
- **Why it exists**: Starts the trip planning flow.
- **System area**: Trip planning (passenger).
- **Who depends on it**: `AppNavigator` (Home stack).
- **Key responsibilities**:
  - Collects destination.
  - Calls `tripService.planTrip({ from, to })`.
  - Navigates to `RouteOptions` with `{ from, to, options }`.
- **Connected to**: `tripService` backend `POST /api/trip/plan`.

### `/src/screens/RouteOptionsScreen.js`
- **Purpose**: Displays route options returned by trip planning, plus places along route.
- **Why it exists**: Lets user pick private bus or view other modes.
- **System area**: Trip planning (passenger).
- **Who depends on it**: `PlanTripScreen` navigation.
- **Key responsibilities**:
  - Accepts `{ from, to, options[] }` via route params.
  - For private-bus: navigates to `PrivateBusOptions`.
  - For other modes: currently navigates to `LiveTracking` in legacy/timeline mode with a route object.
  - Displays “Along this route” place lists per option.
- **Connected to**:
  - `PlaceCard`
  - `LiveTrackingScreen` (legacy mode)
  - `PrivateBusOptionsScreen`.

### `/src/screens/PrivateBusOptionsScreen.js`
- **Purpose**: Lists available private buses on a route segment and computed fares.
- **Why it exists**: Allows user to select a specific bus for live tracking and booking.
- **System area**: Trip planning (passenger).
- **Who depends on it**: `RouteOptionsScreen` navigation.
- **Key responsibilities**:
  - Calls `tripService.getPrivateBusOptions({ routeId, fromStop, toStop })` → `GET /api/bus/private-options`.
  - Renders each bus with frequency and fare.
  - On selection: navigates to `LiveTracking` with `busId`, `busName`, `routeId`, and segment info.
- **Connected to**:
  - Backend `busController.getPrivateBusOptions`.
  - `LiveTrackingScreen`.

### `/src/screens/LiveTrackingScreen.js`
- **Purpose**: Two-mode screen:
  - Passenger live tracking **map mode** (when `busId` param exists)
  - Legacy timeline route stop view (when navigated with a route object)
- **Why it exists**: Provides a single entry for live tracking UX while keeping older flow working.
- **System area**: Live tracking (passenger).
- **Who depends on it**:
  - `PrivateBusOptionsScreen` (passenger mode)
  - `RouteOptionsScreen` (legacy mode for non-private options)
  - `AppNavigator` stack.
- **Key responsibilities (passenger mode)**:
  - Polls `GET /api/live/:busId` every 5s using `setInterval`.
  - Computes distance (Haversine) from user location to bus and estimates ETA from speed.
  - Fetches bus details `GET /api/bus/:busId` to obtain `routeId`, then fetches route polyline `GET /api/bus/route/:routeId`.
  - Requests foreground location once to show “You” marker.
  - Shows “Book Ticket” button **only** when `AuthContext.user.role === 'user'`.
- **Key responsibilities (legacy mode)**:
  - Loads route details via `busService.getRouteDetails(selectedRoute.routeId)` and renders stop timeline.
- **Connected to**:
  - Backend live tracking endpoints (`/api/live/*`)
  - Backend bus endpoints (`/api/bus/:busId`, `/api/bus/route/:routeId`)
  - `BookingConfirmationScreen` navigation
  - `AuthContext` for role gating
  - `expo-location` and `react-native-maps`.

### `/src/screens/BookingConfirmationScreen.js`
- **Purpose**: Confirms and submits a booking request.
- **Why it exists**: Provides explicit user action before creating a booking.
- **System area**: Booking (passenger).
- **Who depends on it**: `LiveTrackingScreen` navigation.
- **Key responsibilities**:
  - Accepts `{ busId, routeId, fromStop, toStop, busName }`.
  - Calls `bookingService.createBooking` → `POST /api/booking`.
  - Shows success alert and navigates back.
- **Connected to**: backend booking endpoint + `bookingService`.

### `/src/screens/PaymentScreen.js`
- **Purpose**: UI-only UPI payment deep-link demonstration.
- **Why it exists**: Earlier flow included payment; now booking flow exists as separate path.
- **System area**: Payments (optional/demo).
- **Who depends on it**: `AppNavigator` stack (reachable if used elsewhere).
- **Key responsibilities**:
  - Builds UPI URL and attempts `Linking.openURL`.
  - Displays trip summary and fare.
- **Connected to**: React Native `Linking`.

### `/src/screens/BusSearchScreen.js`
- **Purpose**: Placeholder screen for bus schedules.
- **Why it exists**: UI entry exists from Home tiles; feature can be expanded later.
- **System area**: Bus schedules (placeholder).
- **Who depends on it**: `AppNavigator` stack.
- **Key responsibilities**: Shows static placeholder UI.

### `/src/screens/ExploreScreen.js`
- **Purpose**: Lists places by type (food/activity/attraction).
- **Why it exists**: Discovery browsing outside of trip flow.
- **System area**: Discovery.
- **Who depends on it**: `AppNavigator` Explore stack and Home tiles.
- **Key responsibilities**:
  - Reads `route.params.type` to determine place type.
  - Calls `placesService.getPlaces({ type })` → `GET /api/places?type=...`.
  - Renders filter chips (UI-only; currently does not change backend query).
  - Renders `PlaceCard` list.

### `/src/screens/SafetyScreen.js`
- **Purpose**: Displays emergency numbers and nearby emergency points.
- **Why it exists**: Safety feature for travelers.
- **System area**: Safety.
- **Who depends on it**: `AppNavigator` Safety stack and Home tiles.
- **Key responsibilities**:
  - Calls `safetyService.getEmergencyPoints()` → `GET /api/emergency`.
  - Groups returned `Place` docs by `subtype` into hospitals/police/fire arrays.
  - Handles 404 with a friendly info alert and safe empty state.
  - Renders `EmergencyCard`s and SOS button (alert simulation).

### `/src/screens/TaxiScreen.js`
- **Purpose**: Lists verified taxis/drivers.
- **Why it exists**: Taxi feature for last-mile transport.
- **System area**: Taxi.
- **Who depends on it**: `AppNavigator` Taxi stack and Home tiles.
- **Key responsibilities**:
  - Calls `taxiService.getTaxis()` → `GET /api/taxis`.
  - Renders cards and “Call” action (alert simulation).

### `/src/screens/DayPlanScreen.js`
- **Purpose**: Generates a day itinerary and displays it as a timeline.
- **Why it exists**: Day planner feature for exploration planning.
- **System area**: Day planner.
- **Who depends on it**: `AppNavigator` DayPlan stack and Home tiles.
- **Key responsibilities**:
  - Collects duration and interests.
  - Maps UI duration to backend duration (`halfDay/fullDay` → `half/full`).
  - Calls `dayPlanService.generatePlan` → `POST /api/dayplan` (auth required).
  - Renders `TimelineStopItem` list.

### `/src/screens/ProfileScreen.js`
- **Purpose**: Profile and settings hub.
- **Why it exists**: Allows user to view identity info, toggle language (local state), apply as driver, and logout.
- **System area**: Profile/settings.
- **Who depends on it**: `AppNavigator` Profile stack.
- **Key responsibilities**:
  - Reads `AuthContext.user`.
  - Shows driver apply button only when `user.role === 'user'`.
  - Calls `logout()` with confirmation.

### `/src/screens/DriverApplyScreen.js`
- **Purpose**: Driver application form for normal users.
- **Why it exists**: Initiates driver verification flow (user → pending request).
- **System area**: Driver verification (user-side).
- **Who depends on it**: `ProfileScreen` navigation; `AppNavigator` Profile stack.
- **Key responsibilities**:
  - Form fields: bus number/operator/license/routeId.
  - Calls `driverService.apply` → `POST /api/driver/apply` (auth).
  - Stores a per-user “pending” flag in `AsyncStorage` to disable resubmission.
  - Displays backend validation errors from `error.response.data.message`.

### `/src/screens/DriverDashboardScreen.js`
- **Purpose**: Driver-only dashboard for starting/stopping GPS live updates.
- **Why it exists**: Implements the driver mode requirement: live tracking updates to backend.
- **System area**: Driver mode, live tracking (producer side).
- **Who depends on it**: `DriverStack` (role-based routing).
- **Key responsibilities**:
  - Fetches assigned bus via `driverService.getAssignedBus()` → `GET /api/driver/assigned-bus`.
  - Starts tracking using `Location.watchPositionAsync` (no setInterval).
  - Posts updates via `liveService.updateLiveLocation()` → `POST /api/live/update` with `{lat,lng,speed,heading}`.
  - Stops tracking on manual stop or error; cleans up watcher on unmount.
- **Connected to**:
  - Backend driver-only live update pipeline (assignedBus enforced server-side).
  - `expo-location`.

### `/src/screens/AdminDashboardScreen.js`
- **Purpose**: Admin-only driver request review and approval UI.
- **Why it exists**: Completes verification workflow by allowing admin to approve/reject applications.
- **System area**: Admin tools.
- **Who depends on it**: `AdminNavigator` (role-based routing).
- **Key responsibilities**:
  - Loads pending requests from `GET /api/admin/driver-requests`.
  - Approves with `POST /api/admin/approve-driver`.
  - Rejects with `POST /api/admin/reject-driver`.
  - Refetches list after actions to keep UI in sync.

### SECTION A — Root Cause of No Repeated Updates

**Root cause is on the driver device, not MongoDB.** The driver app does **not** run any periodic timer/interval to post updates. It relies entirely on `Location.watchPositionAsync(...)` callbacks. Those callbacks only fire when the OS reports a new position fix that satisfies the watcher thresholds.

In `DriverDashboardScreen`, the watcher is configured with **`distanceInterval: 10`** (10 meters). If the driver is **not actually moving ~10m+**, or the OS is not delivering new fixes (common indoors / low GPS quality), the callback will run once and then **not run again**, so `/api/live/update` is only called once.

This matches all symptoms:
- `/api/live/update` returns 200 once
- a `LiveLocation` document exists
- `lastUpdated` never changes afterward
- bus marker never moves (because server data never changes)

Key excerpt:

```81:112:src/screens/DriverDashboardScreen.js
      trackingRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        async (location) => {
          try {
            const { latitude, longitude, speed, heading } = location.coords || {};
            await liveService.updateLiveLocation({
              lat: latitude,
              lng: longitude,
              speed: speed || 0,
              heading: heading || 0,
            });
            setLastUpdatedAt(new Date());
            hasShownSendErrorRef.current = false;
          } catch (error) {
            // ...
            stopTrip();
          }
        }
      );
```

Also, the UI itself states the intended behavior is “every ~5 seconds **while moving**”:

```209:211:src/screens/DriverDashboardScreen.js
        <Text style={styles.helperText}>
          Live tracking posts your GPS coordinates to the server every ~5 seconds while moving.
        </Text>
```

### SECTION B — Why `lastUpdated` Not Changing

On the backend, `lastUpdated` **is** set to `new Date()` on every request, and `findOneAndUpdate` uses `upsert: true` and returns the updated doc (`new: true`). So if repeated requests were arriving, `lastUpdated` would change.

Backend behavior is correct:

```3:35:backend/src/controllers/liveController.js
const update = {
  lat,
  lng,
  speed: speed || 0,
  heading: heading || 0,
  lastUpdated: new Date(),
};

const location = await LiveLocation.findOneAndUpdate(
  { busId },
  update,
  { new: true, upsert: true }
);
```

Therefore, **`lastUpdated` not changing is a direct consequence of `/api/live/update` not being called repeatedly** (i.e., the driver watcher callback is not firing repeatedly).

### SECTION C — Why Bus Marker Not Moving

The passenger map marker position is driven by `liveLocation.lat/lng` returned from `GET /api/live/:busId`. If `LiveLocation` isn’t updating, the API returns the same coordinates and timestamp every poll, so:

- marker coordinate stays constant
- `lastUpdatedSecAgo` grows
- status becomes OFFLINE after 2 minutes

In `LiveTrackingScreen`, the marker is directly bound to `liveLocation`:

```343:351:src/screens/LiveTrackingScreen.js
                <Marker
                  coordinate={{
                    latitude: liveLocation.lat,
                    longitude: liveLocation.lng,
                  }}
                  title="Bus Location"
                  rotation={liveLocation.heading || 0}
                  anchor={{ x: 0.5, y: 0.5 }}
                />
```

### SECTION D — Polling Architecture Assessment

#### Driver side (sending updates)
- **No `setInterval`** is used.
- **Only** `Location.watchPositionAsync` drives repeated sends.
- Updates will stop if:
  - the OS stops emitting new position events (common if not moving enough / GPS conditions)
  - **any** error occurs inside the watcher callback, because the code calls `stopTrip()` on the first send error (this is the only “accidental stop” path besides unmount/manual stop).

Relevant stop-on-error path:

```101:110:src/screens/DriverDashboardScreen.js
} catch (error) {
  if (!hasShownSendErrorRef.current) {
    hasShownSendErrorRef.current = true;
    Alert.alert('Unable to fetch data. Please try again.');
  }
  stopTrip();
}
```

#### Passenger side (polling updates)
Passenger polling is continuous and correctly uses `setInterval`:

```60:99:src/screens/LiveTrackingScreen.js
const fetchLive = async () => {
  if (!busId || inFlightRef.current) return;
  inFlightRef.current = true;
  try {
    const data = await busService.getLiveLocation(busId);
    // setLiveLocation(data) ...
  } finally {
    setLoading(false);
    inFlightRef.current = false;
  }
};

useEffect(() => {
  if (!isPassengerMode) return;
  setLoading(true);
  fetchLive();

  intervalRef.current = setInterval(() => {
    fetchLive();
  }, POLL_INTERVAL_MS);

  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, [isPassengerMode, busId]);
```

- `inFlightRef` prevents overlapping requests; it **does not** prevent repeats unless a request never resolves.
- `apiClient` has a **10s timeout**, so hung requests should eventually reject and clear `inFlightRef` via `finally` (meaning polling resumes).

### SECTION E — Exact File + Line Responsible

- **Primary root cause (no repeated sends unless movement triggers callbacks)**:
  - `src/screens/DriverDashboardScreen.js` **L81–L86**: `Location.watchPositionAsync` configured with `distanceInterval: 10` and no other periodic send mechanism.
  - `src/screens/DriverDashboardScreen.js` **L87–L100**: the **only** place `/api/live/update` is called is inside that watcher callback.

- **Backend confirms it would update `lastUpdated` if called repeatedly**:
  - `backend/src/controllers/liveController.js` **L19–L31**: `lastUpdated: new Date()` and `findOneAndUpdate(..., { new: true, upsert: true })`.

- **Passenger marker depends solely on server values**:
  - `src/screens/LiveTrackingScreen.js` **L343–L351**: marker coordinate uses `liveLocation.lat/lng`.
  - `src/screens/LiveTrackingScreen.js` **L81–L97**: polling loop keeps fetching, but will just re-display stale data if the backend doc doesn’t change.

In short: **the system is behaving as coded—updates are “event-driven by movement,” not “time-driven.”** If the driver’s location events aren’t firing repeatedly, the backend won’t receive repeated updates, so Mongo’s `lastUpdated` and the bus marker won’t change.

### SECTION A — Critical Errors (Must Fix Immediately)

- **A1. LiveTracking polyline fetch hits non-existent backend routes**
  - **Location (frontend)**: `LiveTrackingScreen`
    - Calls `apiClient.get(\`/bus/${busId}\`)` to fetch a bus by ID.
    - Calls `apiClient.get(\`/routes/${bus.routeId}\`)` to fetch route polyline.
  - **Location (backend)**: `routes/bus.js`, `index.js`
    - Only defines:
      - `GET /api/bus/private-options`
      - `GET /api/bus/routes/:routeId`
    - There is **no** `GET /api/bus/:busId` route and **no** `/api/routes/:routeId` router at all.
  - **Impact**:
    - These frontend calls will consistently 404 → map polyline data will never load, and error logs will be noisy.
    - This breaks the intended “show full route polyline on map” feature.

- **A2. `busService.searchRoutes` points to missing backend endpoint**
  - **Location (frontend)**: `src/api/services.js`
    - `busService.searchRoutes` calls `GET /bus/search?from=..&to=..`.
  - **Location (backend)**: `routes/bus.js`
    - There is no `/api/bus/search` route defined.
  - **Impact**:
    - Any part of the app that ever uses `busService.searchRoutes` will fail with 404.
    - Even if unused now, it’s a latent bug and misleading API surface.

- **A3. Booking does not validate bus–route consistency**
  - **Location (backend)**: `controllers/bookingController.js`
    - Validates that `busId` and `routeId` each exist, but does **not** check that the `bus.routeId` matches the `routeId` provided by the client.
  - **Impact**:
    - A client can book a bus and an unrelated route combination, leading to inconsistent bookings (wrong route for bus).
    - Potential downstream logic relying on `booking.routeId` and `booking.busId` being aligned will behave incorrectly.

- **A4. Booking fare ignores distance and front-end fare**
  - **Location (backend)**: `controllers/bookingController.js`
    - Fare is computed as `fare = Number.isFinite(bus.baseFare) ? bus.baseFare : 0;` and ignores:
      - The `farePerKm` on the `Bus` model.
      - The actual `fromStop` / `toStop` segment.
      - The fare estimate previously computed and shown to the user in the private bus options.
  - **Impact**:
    - Booked fare may be wildly different from the fare shown in the UI, leading to a broken or misleading booking system.
    - This is a logic mismatch with the more sophisticated fare calculation used in `getPrivateBusOptions`.

- **A5. Driver live-update API can be called by any driver for any bus assignment**
  - **Location (backend)**:
    - `middleware/roles.js` (`driverOnly`)
    - `controllers/liveController.js` (`updateLiveLocation`)
  - Behavior:
    - `driverOnly` loads the current `User` and attaches `assignedBus` to `req.user`.
    - `updateLiveLocation` uses `req.user.assignedBus` and ensures it’s not null (400 if missing).
  - **Issue**:
    - There’s no cross-check that a driver whose `assignedBus` is updated later cannot continue posting to a previous bus if their local token is stale (JWT contains role but not assignedBus; it’s refetched from DB each time, which is good).
    - The **critical part works**, but the trust model is brittle: if assignedBus is null and the DB is misconfigured, a 400 will occur and the driver app repeatedly stops trips.
  - **Impact**:
    - Misconfigured DB state (driver role but no `assignedBus`) will cause hard failures in live tracking for that driver.

---

### SECTION B — Functional Bugs

- **B1. Admin-only view of pending driver requests relies on backend filter; any future changes could leak data**
  - **Location (backend)**: `controllers/adminController.js`
    - Uses `DriverRequest.find({ status: 'pending' })` → currently correct.
  - **Location (frontend)**: `AdminDashboardScreen`
    - Simply shows whatever `/admin/driver-requests` returns.
  - **Issue**:
    - If the backend filter were accidentally loosened (e.g., replaced with `find({})`), the frontend has no secondary guard and would instantly show approved/rejected requests.
  - **Impact**:
    - Not broken today, but the frontend fully trusts backend status filtering; a small backend change can cause UI leakage of non-pending requests.

- **B2. Booking API allows any authenticated role to book**
  - **Location (backend)**: `routes/booking.js`
    - Uses `authRequired` but no role-specific middleware.
  - **Expected UX**:
    - The flow is described as “User → Select Private Bus → LiveTrackingScreen → Book Ticket”.
  - **Issue**:
    - Drivers and admins can also hit `/api/booking` and book tickets; this is probably unintended.
  - **Impact**:
    - Role semantics around booking are not enforced; leads to confusing behavior if a driver or admin tries to book.

- **B3. Driver application error feedback is generic**
  - **Location (frontend)**: `DriverApplyScreen`
    - On error, uses `const msg = error.userMessage || 'Unable to fetch data. Please try again.'`.
  - **Location (backend)**: `driverController.applyForDriver`
    - Returns meaningful 400 messages, e.g. `"busNumber, operatorName, licenseNumber, and routeId are required"` or `"Invalid routeId"`.
  - **Issue**:
    - Frontend throws away `error.response?.data?.message`, so users never see specific validation messages (e.g. invalid route).
  - **Impact**:
    - Harder for users to correct form errors; feels like a backend/network problem rather than a validation error.

- **B4. Booking screen doesn’t display the actual fare used by backend**
  - **Location (frontend)**: `BookingConfirmationScreen`
    - Uses only `busName`, `fromStop`, `toStop`. It does **not** fetch or show:
      - The calculated fare from backend.
      - The `fare` passed from `PrivateBusOptionsScreen`/`LiveTrackingScreen`.
  - **Combined with A4**:
    - User never sees the actual charged fare at confirmation time.
  - **Impact**:
    - UX inconsistency: booking confirmation does not show the amount, and the backend is free to compute any fare without transparency.

- **B5. LiveTracking polyline endpoint mismatch causes missing route visualization**
  - Already in **A1** (broken routes), but functionally:
  - **Location**: LiveTracking map
    - Without proper `/api/bus/:id` and `/api/bus/routes/:routeId` usage, the route polyline never renders.
  - **Impact**:
    - “Route-based” part of the tracking on the map is non-functional.

---

### SECTION C — Warnings / Code Smells

#### Backend

- **C1. Booking doesn’t use `fromStop`/`toStop` beyond storage**
  - `Booking` schema stores `fromStop` and `toStop`, but `createBooking` uses them only to persist, not in pricing, validation, or logic.
  - This is a smell given all the work around per-segment fares in `getPrivateBusOptions`.

- **C2. Unused / fragile `busService.searchRoutes`**
  - As noted, the service points to a missing endpoint.
  - Even if unused, it suggests the contract is incomplete and invites future misuse.

- **C3. Lack of role checks in some “sensitive” controllers**
  - Example: `/api/dayplan` and `/api/booking` rely solely on `authRequired` without role constraints.
  - This might be intentional, but if you ever want “only users, not drivers/admins” behavior, it’s not enforced.

- **C4. Error handling is generic in a few places**
  - Many controllers return `{ message: 'Server error' }` for all 500s, making debugging harder.
  - You already log `console.error`, which is good, but there’s no structured error type.

#### Frontend

- **C5. LiveTrackingScreen route/ID mismatch with backend path design**
  - It uses bare `/bus/${busId}` and `/routes/${bus.routeId}` instead of going through `busService`, which already knows backend structure (`/bus/routes/:routeId` etc.).
  - This tight-couples the screen to hard-coded paths and duplicates responsibility.

- **C6. LiveTrackingScreen polling control flags**
  - Uses `intervalRef` + `inFlightRef` to prevent concurrent requests; decent, but:
    - `inFlightRef` is never reset if `fetchLive` throws before `finally`.
    - If `fetchLive` is accidentally refactored without `finally`, the flag logic becomes fragile.
  - Currently you *do* reset in `finally`, so it’s OK, but easy to regress.

- **C7. DriverDashboard error alert message is overly generic**
  - On live update failure, the alert shows `"Unable to fetch data. Please try again."` (copied from other screens).
  - This reads more like a fetch error than “failed to send GPS update”, making debugging harder.

- **C8. Authentication state: user vs token**
  - `isAuthenticated` is derived only from `!!token`, not from `user`.
  - If local storage gets into a partial state (token present, user missing), the app will:
    - Consider the user authenticated.
    - Pass `undefined` role into `RootNavigator`, falling back to normal `AppNavigator`.
  - This is safe (no crash) but semantically odd.

#### Data / Model Consistency

- **C9. Booking model has no back-reference in User or Bus**
  - `Booking` references `userId`, `busId`, `routeId` but:
    - `User`, `Bus`, and `BusRoute` schemas do not maintain any reverse index (e.g., `bookings` array).
  - MongoDB doesn’t require this, but querying all bookings for a user or bus will always require separate queries; that’s normal but may be a performance smell if high volume is expected.

- **C10. Seeded driver request is not automatically reconciled**
  - `seed.js` creates a pending `DriverRequest` for the `Normal User`, but there is no automatic job to approve/reject it; only the Admin UI can.
  - That’s conceptually fine, but:
    - The same user could also apply via `POST /api/driver/apply` and create multiple `pending` requests without a uniqueness constraint.

---

### SECTION D — Improvements (Optional)

- **D1. Use service layer consistently in LiveTrackingScreen**
  - Replace raw `apiClient.get('/bus/...')`, `apiClient.get('/routes/...')` calls with dedicated functions in `busService` (or a new `routeService`), matching whatever backend routes you standardize on.
  - This reduces coupling and makes it easier to evolve backend URLs.

- **D2. Strengthen validation and error messages for driver application**
  - Frontend:
    - Surface `error.response?.data?.message` so users see “Invalid routeId” or missing fields.
  - Backend:
    - Optionally check:
      - That a user doesn’t already have a pending request before creating another.
      - That the same busNumber/license combination isn’t duplicated.

- **D3. Align booking fare calculation with private bus fare logic**
  - Reuse the same distance + baseFare + farePerKm logic as `getPrivateBusOptions`, ideally:
    - Compute fare server-side again (trusted).
    - Or re-use an existing helper function to avoid diverging formulas.
  - Then show that exact fare on `BookingConfirmationScreen` by:
    - Returning `fare` from `/api/booking`, and
    - Displaying it clearly before the user confirms.

- **D4. Add role-specific authorization for booking**
  - If business rules say only passengers should book:
    - Introduce a `userOnly` middleware, similar to `driverOnly`/`adminOnly`.
    - Apply it to `/api/booking`.
  - This keeps the intent of “User → Book Ticket” encoded in the backend.

- **D5. Harden map initialization**
  - Consider providing an `initialRegion` on `MapView` and only switching to `region` once coordinates are known.
  - This can reduce occasional map glitches on first render, especially under slow network or if `liveLocation` is temporarily null.

- **D6. Clarify auth invariants**
  - You could enforce that:
    - `user` is never set without `token`, and vice versa.
    - On load, if one item is missing from `AsyncStorage`, clear both.
  - This would tighten the contract around `isAuthenticated` and avoid edge-case states.

- **D7. Add explicit data-level constraints**
  - For `DriverRequest`:
    - Index on `{ userId, status }` and enforce unique pending requests per user.
  - For `Booking`:
    - Index on `userId`, `busId` for faster lookups.

