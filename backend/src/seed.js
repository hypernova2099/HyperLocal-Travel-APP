require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const BusRoute = require('./models/BusRoute');
const Bus = require('./models/Bus');
const Place = require('./models/Place');
const TaxiDriver = require('./models/TaxiDriver');

const seed = async () => {
  await connectDB(process.env.MONGO_URI);

  console.log('Clearing collections...');
  await Promise.all([
    BusRoute.deleteMany({}),
    Bus.deleteMany({}),
    Place.deleteMany({}),
    TaxiDriver.deleteMany({}),
  ]);

  console.log('Inserting routes...');
  const route1 = await BusRoute.create({
    name: 'Fort Kochi – Vyttila Hub',
    from: 'Fort Kochi',
    to: 'Vyttila Hub',
    stops: [
      { name: 'Fort Kochi', lat: 9.966, lng: 76.242 },
      { name: 'Marine Drive', lat: 9.9816, lng: 76.2756 },
      { name: 'Vyttila Hub', lat: 9.9707, lng: 76.3181 },
    ],
    polyline: [
      [9.966, 76.242],
      [9.9816, 76.2756],
      [9.9707, 76.3181],
    ],
  });

  const route2 = await BusRoute.create({
    name: 'Vyttila – Kakkanad',
    from: 'Vyttila',
    to: 'Kakkanad',
    stops: [
      { name: 'Vyttila', lat: 9.9707, lng: 76.3181 },
      { name: 'Palarivattom', lat: 10.005, lng: 76.303 },
      { name: 'Kakkanad', lat: 10.0159, lng: 76.3621 },
    ],
    polyline: [
      [9.9707, 76.3181],
      [10.005, 76.303],
      [10.0159, 76.3621],
    ],
  });

  console.log('Inserting buses...');
  await Bus.insertMany([
    {
      routeId: route1._id,
      name: 'Mahanadi Travels (Pvt)',
      operatorType: 'private',
      frequencyMinutes: 10,
      approxDurationMinutes: 45,
      baseFare: 10,
      farePerKm: 2.5,
    },
    {
      routeId: route1._id,
      name: 'Shalom Bus Services',
      operatorType: 'private',
      frequencyMinutes: 15,
      approxDurationMinutes: 50,
      baseFare: 8,
      farePerKm: 2.2,
    },
    {
      routeId: route1._id,
      name: 'Kochi Metro Feeder',
      operatorType: 'metro',
      frequencyMinutes: 12,
      approxDurationMinutes: 35,
      baseFare: 15,
      farePerKm: 3,
    },
    {
      routeId: route2._id,
      name: 'KSRTC City Rider',
      operatorType: 'ksrtc',
      frequencyMinutes: 18,
      approxDurationMinutes: 30,
      baseFare: 12,
      farePerKm: 2.4,
    },
  ]);

  console.log('Inserting places...');
  await Place.insertMany([
    {
      name: 'Fort Kochi Beach Cafe',
      type: 'food',
      subtype: 'restaurant',
      lat: 9.966,
      lng: 76.242,
      area: 'Fort Kochi',
      rating: 4.5,
      priceLevel: 2,
      isOpenNow: true,
    },
    {
      name: 'Marine Drive Restaurant',
      type: 'food',
      subtype: 'restaurant',
      lat: 9.9816,
      lng: 76.2756,
      area: 'Marine Drive',
      rating: 4.6,
      priceLevel: 2,
      isOpenNow: true,
    },
    {
      name: 'Chinese Fishing Nets',
      type: 'attraction',
      subtype: 'landmark',
      lat: 9.9668,
      lng: 76.2424,
      area: 'Fort Kochi',
      rating: 4.8,
      priceLevel: 1,
      isOpenNow: true,
    },
    {
      name: 'Lulu Mall',
      type: 'activity',
      subtype: 'shopping',
      lat: 10.027,
      lng: 76.308,
      area: 'Edappally',
      rating: 4.4,
      priceLevel: 3,
      isOpenNow: true,
    },
  ]);

  console.log('Inserting taxi drivers...');
  await TaxiDriver.insertMany([
    {
      name: 'Rajesh Kumar',
      phone: '+91 9876543210',
      vehicle: 'Maruti Swift',
      area: 'Fort Kochi',
      rating: 4.8,
      languages: ['English', 'Malayalam'],
    },
    {
      name: 'Suresh Menon',
      phone: '+91 9876543211',
      vehicle: 'Hyundai i20',
      area: 'Vyttila',
      rating: 4.6,
      languages: ['English', 'Malayalam', 'Hindi'],
    },
  ]);

  console.log('Seeding complete.');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
