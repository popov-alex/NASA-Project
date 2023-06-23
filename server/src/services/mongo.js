import mongoose from 'mongoose';

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

export const mongoConnect = async (URL) => await mongoose.connect(URL);

export const mongoDisconnect = async () => await mongoose.disconnect();
