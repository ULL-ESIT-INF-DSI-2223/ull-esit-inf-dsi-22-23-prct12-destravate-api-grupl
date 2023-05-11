/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Curso: 3º
 * Práctica 12: API REST Destravate
 * @author Ismael Martín Herrera
 * @author Alberto Zarza Martín
 * @email alu0101397375@ull.edu.es
 * @date 15/05/2023
 */

import {Document, Schema, model } from 'mongoose';
import { UsersDocumentInterface } from './users.js';

export type Actividad = "bicicleta" | "correr";
export type GeoLocalization = [number, number]

/** 
 * Interfaz que define las propiedades que debe tener un documento de Track
 * @interface TrackDocumentInterface
 * @param {number} id - id del track
 * @param {string} name - nombre del track
 * @param {GeoLocalization} initialGeo - localización inicial del track
 * @param {GeoLocalization} finalGeo - localización final del track
 * @param {number} kmLength - longitud del track
 * @param {number} avegLevel - nivel medio del track
 *  @param {UsersDocumentInterface[]} users - usuarios que han realizado el track
 * @param {Actividad} activityType - tipo de actividad del track
 * @param {number} avegMark - nota media del track
 */
export interface TrackDocumentInterface extends Document {
  id: number;
  name: string;
  initialGeo: GeoLocalization;
  finalGeo: GeoLocalization;
  kmLength: number;
  avegLevel: number;
  users: UsersDocumentInterface[];
  activityType: Actividad;
  avegMark: number;
}

/** 
 * Esquema de Track
 * @const TrackSchema
 * @param {number} id - id del track
 * @param {string} name - nombre del track
 * @param {GeoLocalization} initialGeo - localización inicial del track
 * @param {GeoLocalization} finalGeo - localización final del track
 * @param {number} kmLength - longitud del track
 * @param {number} avegLevel - nivel medio del track
 * @param {UsersDocumentInterface[]} users - usuarios que han realizado el track
 * @param {Actividad} activityType - tipo de actividad del track
 * @param {number} avegMark - nota media del track
 * @returns {TrackDocumentInterface}
 * 
 */
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
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User',
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

