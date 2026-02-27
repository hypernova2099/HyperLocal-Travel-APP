require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const BusRoute = require('./models/BusRoute');
const Bus = require('./models/Bus');
const Place = require('./models/Place');
const TaxiDriver = require('./models/TaxiDriver');
const User = require('./models/User');
const DriverRequest = require('./models/DriverRequest');
const LiveLocation = require('./models/LiveLocation');

const seed = async () => {
  await connectDB(process.env.MONGO_URI);

  console.log('Clearing collections...');
  await Promise.all([
    BusRoute.deleteMany({}),
    Bus.deleteMany({}),
    Place.deleteMany({}),
    TaxiDriver.deleteMany({}),
    User.deleteMany({}),
    DriverRequest.deleteMany({}),
    LiveLocation.deleteMany({}),
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
  const insertedBuses = await Bus.insertMany([
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

  // Ensure we have at least 2 buses to assign to drivers
  const busForDriver1 = insertedBuses[0]?._id || null;
  const busForDriver2 = insertedBuses[1]?._id || insertedBuses[0]?._id || null;

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

  console.log('Inserting users (admin, drivers, normal user)...');
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const driver1PasswordHash = await bcrypt.hash('Driver@123', 10);
  const driver2PasswordHash = await bcrypt.hash('Driver2@123', 10);
  const userPasswordHash = await bcrypt.hash('User@123', 10);

  const adminUser = await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    passwordHash: adminPasswordHash,
    role: 'admin',
  });

  const driverUser1 = await User.create({
    name: 'Driver One',
    email: 'driver1@test.com',
    passwordHash: driver1PasswordHash,
    role: 'driver',
    assignedBus: busForDriver1,
  });

  const driverUser2 = await User.create({
    name: 'Driver Two',
    email: 'driver2@test.com',
    passwordHash: driver2PasswordHash,
    role: 'driver',
    assignedBus: busForDriver2,
  });

  const normalUser = await User.create({
    name: 'Normal User',
    email: 'user@test.com',
    passwordHash: userPasswordHash,
    role: 'user',
  });

  console.log('Inserting pending driver request...');
  await DriverRequest.create({
    userId: normalUser._id,
    busNumber: 'KL-07-AB-1234',
    operatorName: 'Sample Operator',
    licenseNumber: 'LIC123456',
    routeId: route1._id,
    status: 'pending',
  });

  console.log('Seeding live location for driver1 bus...');
  if (driverUser1.assignedBus) {
    await LiveLocation.findOneAndUpdate(
      { busId: driverUser1.assignedBus },
      {
        lat: 9.965,
        lng: 76.242,
        speed: 30,
        heading: 180,
        lastUpdated: new Date(),
      },
      { new: true, upsert: true }
    );
  }

  console.log('Seeding complete.');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
