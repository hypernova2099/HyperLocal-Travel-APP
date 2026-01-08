import apiClient from './apiClient';
import * as mockApi from './mockApi';

// Helper function to try real API and fallback to mock
const tryApiWithFallback = async (apiCall, mockCall) => {
  try {
    const response = await apiCall();
    return response.data || response;
  } catch (error) {
    console.log('API call failed, using mock data:', error.message);
    return await mockCall();
  }
};

// Auth Services
export const authService = {
  async register({ name, email, password }) {
    return tryApiWithFallback(
      () => apiClient.post('/api/auth/register', { name, email, password }),
      () => mockApi.mockAuth.register({ name, email, password })
    );
  },

  async login({ email, password }) {
    return tryApiWithFallback(
      () => apiClient.post('/api/auth/login', { email, password }),
      () => mockApi.mockAuth.login({ email, password })
    );
  },
};

// Bus/Routes Services
export const busService = {
  async searchRoutes({ from, to }) {
    return tryApiWithFallback(
      () => apiClient.get(`/api/bus/search?from=${from}&to=${to}`),
      () => mockApi.mockBus.searchRoutes({ from, to })
    );
  },

  async getRouteDetails(routeId) {
    return tryApiWithFallback(
      () => apiClient.get(`/api/bus/routes/${routeId}`),
      () => mockApi.mockBus.getRouteDetails(routeId)
    );
  },

  async getLiveLocation(busId) {
    return tryApiWithFallback(
      () => apiClient.get(`/api/live-location/${busId}`),
      () => mockApi.mockBus.getLiveLocation(busId)
    );
  },
};

// Places Services
export const placesService = {
  async getPlacesAlongRoute({ routeId, type }) {
    return tryApiWithFallback(
      () => apiClient.get(`/api/places/along-route?routeId=${routeId}&type=${type}`),
      () => mockApi.mockPlaces.getPlacesAlongRoute({ routeId, type })
    );
  },

  async getPlaces({ type }) {
    return tryApiWithFallback(
      () => apiClient.get(`/api/places?type=${type}`),
      () => mockApi.mockPlaces.getPlaces({ type })
    );
  },
};

// Safety Services
export const safetyService = {
  async getEmergencyPoints() {
    return tryApiWithFallback(
      () => apiClient.get('/api/emergency'),
      () => mockApi.mockSafety.getEmergencyPoints()
    );
  },
};

// Taxi Services
export const taxiService = {
  async getTaxis() {
    return tryApiWithFallback(
      () => apiClient.get('/api/taxis'),
      () => mockApi.mockTaxi.getTaxis()
    );
  },
};

// Day Plan Services
export const dayPlanService = {
  async generatePlan({ duration, interests }) {
    return tryApiWithFallback(
      () => apiClient.post('/api/dayplan', { duration, interests }),
      () => mockApi.mockDayPlan.generatePlan({ duration, interests })
    );
  },
};

// Trip Planning Services
export const tripService = {
  async planTrip({ from, to }) {
    return tryApiWithFallback(
      () => apiClient.post('/api/trip/plan', { from, to }),
      () => mockApi.mockTripPlan.planTrip({ from, to })
    );
  },

  async getPrivateBusOptions({ routeId, fromStop, toStop }) {
    return tryApiWithFallback(
      () => apiClient.get(`/api/bus/private-options?routeId=${routeId}&fromStop=${fromStop}&toStop=${toStop}`),
      () => mockApi.mockPrivateBusOptions.getPrivateBusOptions({ routeId, fromStop, toStop })
    );
  },
};

