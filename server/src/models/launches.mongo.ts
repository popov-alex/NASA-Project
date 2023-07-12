import mongoose from 'mongoose';

export interface LaunchDocument {
  flightNumber: number;
  launchDate: Date;
  mission: string;
  rocket: string;
  customers: string[];
  success: boolean;
  upcoming: boolean;
  target: string;
}

const launchesSchema = new mongoose.Schema<LaunchDocument>({
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
  if (path !== 'target') {
    launchesSchema.path(path).required(true);
  }
});

export const launches = mongoose.model<LaunchDocument>(
  'Launch',
  launchesSchema
);
