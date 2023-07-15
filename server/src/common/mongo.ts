import mongoose, { Error } from 'mongoose';

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err: Error) => {
  console.error(err);
});

export const mongoConnect = async (URL: string) => await mongoose.connect(URL);

export const mongoDisconnect = async () => await mongoose.disconnect();
