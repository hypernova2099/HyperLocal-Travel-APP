import apiClient from './apiClient';

// Helper function to extract data from response or throw error
const handleResponse = (response) => {
  return response.data || response;
};

// Auth Services (real backend only)
export const authService = {
  async register({ name, email, password }) {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return handleResponse(response);
  },

  async login({ email, password }) {
    const response = await apiClient.post('/auth/login', { email, password });
    return handleResponse(response);
  },
};

// Bus/Routes Services (real backend only)
export const busService = {
  async searchRoutes({ from, to }) {
    const response = await apiClient.get(`/bus/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    return handleResponse(response);
  },

  async getRouteDetails(routeId) {
    const response = await apiClient.get(`/bus/routes/${routeId}`);
    return handleResponse(response);
  },

  async getLiveLocation(busId) {
    // Live location endpoint from backend
    const response = await apiClient.get(`/live/${busId}`);
    return handleResponse(response);
  },
};

// Places Services (real backend only)
export const placesService = {
  async getPlacesAlongRoute({ routeId, type }) {
    const response = await apiClient.get(`/places/along-route?routeId=${routeId}&type=${encodeURIComponent(type)}`);
    return handleResponse(response);
  },

  async getPlaces({ type }) {
    const response = await apiClient.get(`/places?type=${encodeURIComponent(type)}`);
    return handleResponse(response);
  },
};

// Safety Services (real backend only)
export const safetyService = {
  async getEmergencyPoints() {
    const response = await apiClient.get('/emergency');
    return handleResponse(response);
  },
};

// Taxi Services (real backend only)
export const taxiService = {
  async getTaxis() {
    const response = await apiClient.get('/taxis');
    return handleResponse(response);
  },
};

// Day Plan Services (real backend only; requires auth)
export const dayPlanService = {
  async generatePlan({ duration, interests }) {
    const response = await apiClient.post('/dayplan', { duration, interests });
    return handleResponse(response);
  },

  async getMyDayPlans() {
    const response = await apiClient.get('/dayplan/my');
    return handleResponse(response);
  },
};

// Trip Planning Services (real backend only)
export const tripService = {
  async planTrip({ from, to }) {
    const response = await apiClient.post('/trip/plan', { from, to });
    return handleResponse(response);
  },

  async getPrivateBusOptions({ routeId, fromStop, toStop }) {
    const qs = `routeId=${encodeURIComponent(routeId)}&fromStop=${encodeURIComponent(fromStop)}&toStop=${encodeURIComponent(toStop)}`;
    const response = await apiClient.get(`/bus/private-options?${qs}`);
    return handleResponse(response);
  },
};

// Driver Services (requires auth)
export const driverService = {
  async apply({ busNumber, operatorName, licenseNumber, routeId }) {
    const response = await apiClient.post('/driver/apply', {
      busNumber,
      operatorName,
      licenseNumber,
      routeId,
    });
    return handleResponse(response);
  },
};

// Live Tracking Services (driverOnly, no busId in body)
export const liveService = {
  async updateLiveLocation({ lat, lng, speed, heading }) {
    const response = await apiClient.post('/live/update', {
      lat,
      lng,
      speed,
      heading,
    });
    return handleResponse(response);
  },
};
