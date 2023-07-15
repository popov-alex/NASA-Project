import mongoose, { Document } from 'mongoose';

export interface PlanetDocument extends Document {
  keplerName: string;
}

const planetsSchema = new mongoose.Schema<PlanetDocument>({
  keplerName: { type: String, required: true },
});

export const planets = mongoose.model<PlanetDocument>('Planet', planetsSchema);
