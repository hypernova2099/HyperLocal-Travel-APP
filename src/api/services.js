import apiClient from './apiClient';

// Helper function to extract data from response or throw error
const handleResponse = (response) => {
  return response.data || response;
};

// Auth Services - NO MOCK FALLBACKS
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

// Bus/Routes Services - NO MOCK FALLBACKS
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
    const response = await apiClient.get(`/live-location/${busId}`);
    return handleResponse(response);
  },
};

// Places Services - NO MOCK FALLBACKS
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

// Safety Services - NO MOCK FALLBACKS
export const safetyService = {
  async getEmergencyPoints() {
    const response = await apiClient.get('/emergency');
    return handleResponse(response);
  },
};

// Taxi Services - NO MOCK FALLBACKS
export const taxiService = {
  async getTaxis() {
    const response = await apiClient.get('/taxis');
    return handleResponse(response);
  },
};

// Day Plan Services - NO MOCK FALLBACKS (requires auth)
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

// Trip Planning Services - NO MOCK FALLBACKS
export const tripService = {
  async planTrip({ from, to }) {
    const response = await apiClient.post('/trip/plan', { from, to });
    return handleResponse(response);
  },

  async getPrivateBusOptions({ routeId, fromStop, toStop }) {
    const params = new URLSearchParams({
      routeId,
      fromStop: encodeURIComponent(fromStop),
      toStop: encodeURIComponent(toStop),
    });
    const response = await apiClient.get(`/bus/private-options?${params.toString()}`);
    return handleResponse(response);
  },
};
