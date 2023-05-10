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
import {UsersDocumentInterface} from './users.js';
import { TrackDocumentInterface } from './tracks.js';


export interface GroupsDocumentInterface extends Document {
  id: number;
  name: string;
  participants: UsersDocumentInterface[];
  stats: [[number, number], [number, number], [number, number]];
  ranking: number[];
  favouriteRoutes: TrackDocumentInterface[];
  historicRoutes: [
    {
      date: string,
      route: [string]
    }
  ]
}

const GroupsSchema = new Schema<GroupsDocumentInterface>({
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
  participants: {
    type: [Schema.Types.ObjectId],
    ref: 'Users',
    required: true
  },
  stats: {
    type: [[Number, Number], [Number, Number], [Number, Number]],
    required: true,
  },
  ranking: {
    type: [Number],
    required: true,
  },
  favouriteRoutes: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Tracks'
  },
  historicRoutes: [
    {
      date: {
        type: String,
        required: true,
        validate: {
          validator: function(v: string) {
            return /^\d{2}-\d{2}-\d{4}$/.test(v);
          },
          message: props => `${props.value} is not a valid date format (dd-mm-yyyy)!`
        }
      },
      route: [String]
    }
  ]
});

export const GroupsModel = model<GroupsDocumentInterface>('Groups', GroupsSchema);
  