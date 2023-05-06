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

import { Document, Schema, model } from 'mongoose';
import { UsersDocumentInterface } from './users.js';
import { TrackDocumentInterface } from './tracks.js';


export interface ChallengeDocumentInterface extends Document {
  id: number;
  name: string;
  ruteChallenge: TrackDocumentInterface[];
  typeActivitie: "bicicleta" | "correr";
  kmTotal: number;
  idUsersCahllenge: UsersDocumentInterface[];

}

const ChallengeSchema = new Schema<ChallengeDocumentInterface>({

  id: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  ruteChallenge: {
    type: [Schema.Types.ObjectId],
    ref: 'Track',
    required: true
  },
  typeActivitie: {
    type: String, 
    default: "bicicleta",
    enum: ["bicicleta", "correr"] 
  },
  kmTotal: {
    type: Number,
    required: true
  },
  idUsersCahllenge: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true
  }
});

export const Challenges = model<ChallengeDocumentInterface>('Challenge', ChallengeSchema);