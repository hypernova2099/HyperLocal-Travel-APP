// Mock API data for development and fallback when backend is unavailable

// Mock delay to simulate network request
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Auth API
export const mockAuth = {
  async register({ name, email, password }) {
    await delay();
    return {
      user: {
        _id: 'mock_user_1',
        name,
        email,
      },
      message: 'Registration successful',
    };
  },

  async login({ email, password }) {
    await delay();
    return {
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        _id: 'mock_user_1',
        name: 'John Doe',
        email,
      },
    };
  },
};

// Mock Bus/Routes API
export const mockBus = {
  async searchRoutes({ from, to }) {
    await delay();
    return [
      {
        routeId: 'route_1',
        mode: 'bus',
        lineName: 'Private Bus (Red/Blue)',
        duration: 45,
        fare: 25,
        frequency: 'Every 10 min',
        from,
        to,
      },
      {
        routeId: 'route_2',
        mode: 'metro',
        lineName: 'Metro Line 1',
        duration: 30,
        fare: 20,
        frequency: 'Fastest ⚡',
        from,
        to,
      },
      {
        routeId: 'route_3',
        mode: 'auto',
        lineName: 'Auto/Taxi',
        duration: 25,
        fare: 50,
        frequency: 'Door-to-Door',
        from,
        to,
      },
    ];
  },

  async getRouteDetails(routeId) {
    await delay();
    return {
      routeId,
      stops: [
        { id: 'stop_1', name: 'Start Point', time: '10:00 AM', distance: 0 },
        { id: 'stop_2', name: 'Marine Drive', time: '10:15 AM', distance: 5 },
        { id: 'stop_3', name: 'Vyttila Hub', time: '10:30 AM', distance: 10 },
        { id: 'stop_4', name: 'Kakkanad', time: '10:45 AM', distance: 16 },
      ],
      polyline: [], // Empty for now
      totalDistance: 16,
    };
  },

  async getLiveLocation(busId) {
    await delay();
    return {
      lat: 9.9312,
      lng: 76.2673,
      speed: 35,
      updatedAt: new Date().toISOString(),
    };
  },
};

// Mock Places API
export const mockPlaces = {
  async getPlacesAlongRoute({ routeId, type }) {
    await delay();
    return [
      {
        id: 'place_1',
        name: 'Fort Kochi Beach',
        type,
        area: 'Fort Kochi',
        rating: 4.5,
        distance: 800,
        distanceMode: 'Walk',
        image: null,
      },
      {
        id: 'place_2',
        name: 'Chinese Fishing Nets',
        type,
        area: 'Fort Kochi',
        rating: 4.7,
        distance: 1200,
        distanceMode: 'Walk',
        image: null,
      },
    ];
  },

  async getPlaces({ type }) {
    await delay();
    return [
      {
        id: 'place_1',
        name: 'Fort Kochi Beach',
        type,
        area: 'Fort Kochi',
        rating: 4.5,
        distance: 800,
        distanceMode: 'Walk',
        image: null,
      },
      {
        id: 'place_2',
        name: 'Marine Drive',
        type,
        area: 'Ernakulam',
        rating: 4.6,
        distance: 1500,
        distanceMode: 'Walk',
        image: null,
      },
      {
        id: 'place_3',
        name: 'Lulu Mall',
        type,
        area: 'Edappally',
        rating: 4.4,
        distance: 5000,
        distanceMode: 'Auto',
        image: null,
      },
    ];
  },
};

// Mock Safety API
export const mockSafety = {
  async getEmergencyPoints() {
    await delay();
    return {
      hospitals: [
        {
          id: 'hosp_1',
          name: 'Fort Kochi General Hospital',
          type: 'hospital',
          distance: 500,
          distanceMode: 'Walk',
          phone: '108',
        },
      ],
      police: [
        {
          id: 'police_1',
          name: 'Fort Kochi Police Station',
          type: 'police',
          distance: 800,
          distanceMode: 'Walk',
          phone: '100',
        },
      ],
      fire: [
        {
          id: 'fire_1',
          name: 'Fort Kochi Fire Station',
          type: 'fire',
          distance: 1200,
          distanceMode: 'Walk',
          phone: '101',
        },
      ],
    };
  },
};

// Mock Taxi API
export const mockTaxi = {
  async getTaxis() {
    await delay();
    return [
      {
        id: 'taxi_1',
        driverName: 'Rajesh Kumar',
        vehicle: 'Maruti Swift',
        vehicleNumber: 'KL-01-AB-1234',
        area: 'Fort Kochi',
        rating: 4.8,
        phone: '+91 9876543210',
      },
      {
        id: 'taxi_2',
        driverName: 'Suresh Menon',
        vehicle: 'Hyundai i20',
        vehicleNumber: 'KL-01-CD-5678',
        area: 'Marine Drive',
        rating: 4.6,
        phone: '+91 9876543211',
      },
    ];
  },
};

// Mock Day Plan API
export const mockDayPlan = {
  async generatePlan({ duration, interests }) {
    await delay();
    return [
      {
        id: 'plan_1',
        time: '9:00 AM',
        type: 'attraction',
        name: 'Fort Kochi Beach',
        description: 'Start your day with a peaceful walk',
        duration: '1 hour',
      },
      {
        id: 'plan_2',
        time: '10:30 AM',
        type: 'food',
        name: 'Kashi Art Cafe',
        description: 'Breakfast at popular local cafe',
        duration: '1 hour',
      },
      {
        id: 'plan_3',
        time: '12:00 PM',
        type: 'attraction',
        name: 'Chinese Fishing Nets',
        description: 'Watch traditional fishing methods',
        duration: '1.5 hours',
      },
      {
        id: 'plan_4',
        time: '2:00 PM',
        type: 'food',
        name: 'Fort House Restaurant',
        description: 'Lunch with backwater views',
        duration: '1.5 hours',
      },
    ];
  },
};

// Mock Trip Planning API
export const mockTripPlan = {
  async planTrip({ from, to }) {
    await delay();
    return {
      from,
      to,
      options: [
        {
          mode: 'private-bus',
          routeId: 'route123',
          label: 'Private Bus',
          summary: {
            durationMinutes: 45,
            fareEstimate: 25,
            frequencyMinutes: 10,
          },
          placesAlongRoute: {
            food: [
              {
                id: 'food_1',
                name: 'Fort Kochi Beach Cafe',
                area: 'Fort Kochi',
                rating: 4.5,
                distance: 800,
                distanceMode: 'Walk',
              },
              {
                id: 'food_2',
                name: 'Marine Drive Restaurant',
                area: 'Ernakulam',
                rating: 4.6,
                distance: 5000,
                distanceMode: 'Bus',
              },
            ],
            activities: [
              {
                id: 'activity_1',
                name: 'Beach Walk',
                area: 'Fort Kochi',
                rating: 4.7,
                distance: 1200,
                distanceMode: 'Walk',
              },
            ],
            attractions: [
              {
                id: 'attraction_1',
                name: 'Chinese Fishing Nets',
                area: 'Fort Kochi',
                rating: 4.8,
                distance: 1500,
                distanceMode: 'Walk',
              },
              {
                id: 'attraction_2',
                name: 'Marine Drive',
                area: 'Ernakulam',
                rating: 4.6,
                distance: 5000,
                distanceMode: 'Bus',
              },
            ],
          },
        },
        {
          mode: 'auto',
          label: 'Auto/Taxi',
          summary: {
            durationMinutes: 40,
            fareEstimate: 150,
          },
          placesAlongRoute: {
            food: [
              {
                id: 'food_3',
                name: 'Street Food Corner',
                area: 'Fort Kochi',
                rating: 4.4,
                distance: 600,
                distanceMode: 'Walk',
              },
            ],
            activities: [],
            attractions: [
              {
                id: 'attraction_3',
                name: 'Fort Kochi Beach',
                area: 'Fort Kochi',
                rating: 4.5,
                distance: 800,
                distanceMode: 'Walk',
              },
            ],
          },
        },
        {
          mode: 'metro',
          label: 'Metro',
          summary: {
            durationMinutes: 30,
            fareEstimate: 50,
          },
          placesAlongRoute: {
            food: [
              {
                id: 'food_4',
                name: 'Metro Station Cafe',
                area: 'Vyttila',
                rating: 4.3,
                distance: 200,
                distanceMode: 'Walk',
              },
            ],
            activities: [],
            attractions: [],
          },
        },
      ],
    };
  },
};

// Mock Private Bus Options API
export const mockPrivateBusOptions = {
  async getPrivateBusOptions({ routeId, fromStop, toStop }) {
    await delay();
    return {
      routeId,
      fromStop,
      toStop,
      buses: [
        {
          _id: 'bus101',
          name: 'Mahanadi Travels (Pvt)',
          operatorType: 'private',
          frequencyMinutes: 10,
          fare: 25,
        },
        {
          _id: 'bus102',
          name: 'Shalom Bus Services',
          operatorType: 'private',
          frequencyMinutes: 15,
          fare: 22,
        },
        {
          _id: 'bus103',
          name: 'Kerala Travels',
          operatorType: 'private',
          frequencyMinutes: 12,
          fare: 28,
        },
      ],
    };
  },
};

