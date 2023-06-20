import mongoose from 'mongoose';

const planetsSchema = new mongoose.Schema({
  keplerName: { type: String, required: Boolean },
});

export const planets = mongoose.model('Planet', planetsSchema);
