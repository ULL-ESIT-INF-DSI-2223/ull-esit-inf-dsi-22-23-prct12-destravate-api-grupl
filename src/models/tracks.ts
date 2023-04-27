import {Document, Schema, model } from 'mongoose';

export type Actividad = "bicicleta" | "correr";
export type GeoLocalization = [number, number]


interface TrackDocumentInterface extends Document {
  id: number;
  nombre: string;
  geolocalizacionInicio: GeoLocalization;
  geolocalizacionFinal: GeoLocalization;
  longitudKm: number;
  desnivelMedio: number;
  Usuarios: number[];
  tipoActividad: Actividad;
  calificacionMedia: number;
}

const TrackSchema = new Schema<TrackDocumentInterface>({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  geolocalizacionInicio: {
    type: [Number, Number],
    required: true,
  },
  geolocalizacionFinal: {
    type: [Number, Number],
    required: true,
  },
  longitudKm: {
    type: Number,
    required: true,
  },
  desnivelMedio: {
    type: Number,
    required: true,
  },
  Usuarios: {
    type: [Number],
    required: true,
  },
  tipoActividad: {
    type: String,
    default: "bicicleta",
    enum: ["bicicleta", "correr"],
  },
  calificacionMedia: {
    type: Number,
    required: true,
  },
});

export const Track = model<TrackDocumentInterface>('Track', TrackSchema);

