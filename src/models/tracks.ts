import {Document, Schema, model } from 'mongoose';

export type Actividad = "bicicleta" | "correr";
export type GeoLocalization = [number, number]


interface TrackDocumentInterface extends Document {
  id: number;
  name: string;
  initialGeo: GeoLocalization;
  finalGeo: GeoLocalization;
  kmLength: number;
  avegLevel: number;
  users: number[];
  activityType: Actividad;
  avegMark: number;
}

const TrackSchema = new Schema<TrackDocumentInterface>({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  initialGeo: {
    type: [Number, Number],
    required: true,
  },
  finalGeo: {
    type: [Number, Number],
    required: true,
  },
  kmLength: {
    type: Number,
    required: true,
  },
  avegLevel: {
    type: Number,
    required: true,
  },
  users: {
    type: [Number],
    required: true,
  },
  activityType: {
    type: String,
    default: "bicicleta",
    enum: ["bicicleta", "correr"],
  },
  avegMark: {
    type: Number,
    required: true,
  },
});

export const Track = model<TrackDocumentInterface>('Track', TrackSchema);

