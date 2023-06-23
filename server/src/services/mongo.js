import mongoose from 'mongoose';

//fix env not working
const MONGODB_URL = 'mongodb+srv://Sasha:Sasha@nasa-api.bc2sczc.mongodb.net/';

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

export const mongoConnect = async () => await mongoose.connect(MONGODB_URL);

export const mongoDisconnect = async () => await mongoose.disconnect();
