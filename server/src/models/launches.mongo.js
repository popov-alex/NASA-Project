import mongoose from 'mongoose';

const launchesSchema = new mongoose.Schema({
  flightNumber: Number,
  launchDate: Date,
  mission: String,
  rocket: String,
  customers: [String],
  success: Boolean,
  upcoming: Boolean,
  target: String,
});

Object.keys(launchesSchema.paths).forEach((path) => {
  launchesSchema.path(path).required(true);
});

export const launches = mongoose.model('Launch', launchesSchema)

