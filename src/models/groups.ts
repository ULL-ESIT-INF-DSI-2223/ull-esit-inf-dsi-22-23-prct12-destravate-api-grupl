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

/**
 * Interface que define las propiedades que debe tener un documento de la colección Groups
 * @interface GroupsDocumentInterface
 * @extends Document
 * @property {number} id - Identificador del grupo
 * @property {string} name - Nombre del grupo
 * @property {UsersDocumentInterface[]} participants - Array de usuarios que pertenecen al grupo
 * @property {[[number, number], [number, number], [number, number]]} stats - Estadísticas del grupo
 * @property {number[]} ranking - Ranking del grupo
 * @property {TrackDocumentInterface[]} favouriteRoutes - Rutas favoritas del grupo
 * @property {[[string, string, string]]} historicRoutes - Rutas históricas del grupo
 * @property {string} date - Fecha de la ruta
 * @property {string} route - Ruta
 */
export interface GroupsDocumentInterface extends Document {
  id: number;
  name: string;
  participants: UsersDocumentInterface[];
  stats: [[number, number], [number, number], [number, number]];
  ranking: UsersDocumentInterface[];
  favouriteRoutes: TrackDocumentInterface[];
  historicRoutes: [
    {
      date: string,
      route: [string]
    }
  ]
}

/**
 * Esquema de la colección Groups
 * @const GroupsSchema
 * @type {Schema<GroupsDocumentInterface>}
 * @property {number} id - Identificador del grupo
 * @property {string} name - Nombre del grupo
 * @property {UsersDocumentInterface[]} participants - Array de usuarios que pertenecen al grupo
 * @property {[[number, number], [number, number], [number, number]]} stats - Estadísticas del grupo
 * @property {number[]} ranking - Ranking del grupo
 * @property {TrackDocumentInterface[]} favouriteRoutes - Rutas favoritas del grupo
 * @property {[[string, string, string]]} historicRoutes - Rutas históricas del grupo
 * @property {string} date - Fecha de la ruta
 * @property {string} route - Ruta
  */
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
    ref: 'User',
    required: true
  },
  stats: {
    type: [[Number, Number], [Number, Number], [Number, Number]],
    required: true,
  },
  ranking: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User'
  },
  favouriteRoutes: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Track'
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

export const GroupsModel = model<GroupsDocumentInterface>('Group', GroupsSchema);
  