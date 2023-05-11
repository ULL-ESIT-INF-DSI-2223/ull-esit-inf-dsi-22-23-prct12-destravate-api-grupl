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
import { GroupsDocumentInterface } from './groups.js';
import { TrackDocumentInterface } from './tracks.js';
import { ChallengeDocumentInterface } from './challenges.js';


/**
 * Interface que define las propiedades que debe tener un documento de la colección Users
 * @interface UsersDocumentInterface
 * @extends Document
 * @property {number} id - Identificador único del usuario
 * @property {string} name - Nombre del usuario
 * @property {"bicicleta" | "correr"} activities - Actividad principal del usuario
 * @property {UsersDocumentInterface[]} friends - Lista de amigos del usuario
 * @property {GroupsDocumentInterface[]} groups - Lista de grupos del usuario
 *  @property {[[number, number], [number, number], [number, number]]} stats - Estadísticas del usuario
 * @property {TrackDocumentInterface[]} favRoutes - Lista de rutas favoritas del usuario
 * @property {ChallengeDocumentInterface[]} activeChallenges - Lista de retos activos del usuario
 * @property {[[string, string]]} historicRoutes - Lista de rutas históricas del usuario
 * @property {string} date - Fecha de la ruta histórica
 * @property {string[]} route - Ruta histórica
 * 
 */
export interface UsersDocumentInterface extends Document {

  id: number;
  name: string; 
  activities: "bicicleta" | "correr";
  friends: UsersDocumentInterface[];
  groups: GroupsDocumentInterface[];
  stats: [[number, number], [number, number], [number, number]];
  favRoutes: TrackDocumentInterface[];
  activeChallenges: ChallengeDocumentInterface[];
  historicRoutes: [
    {
      date: string,
      route: [string]
    }
  ];
}

/**
 * Esquema de la colección Users
 * @const UsersSchema
 * @type {Schema<UsersDocumentInterface>}
 * @property {number} id - Identificador único del usuario
 * @property {string} name - Nombre del usuario
 * @property {"bicicleta" | "correr"} activities - Actividad principal del usuario
 * @property {UsersDocumentInterface[]} friends - Lista de amigos del usuario
 * @property {GroupsDocumentInterface[]} groups - Lista de grupos del usuario
 * @property {[[number, number], [number, number], [number, number]]} stats - Estadísticas del usuario
 * @property {TrackDocumentInterface[]} favRoutes - Lista de rutas favoritas del usuario
 * @property {ChallengeDocumentInterface[]} activeChallenges - Lista de retos activos del usuario
 * @property {[[string, string]]} historicRoutes - Lista de rutas históricas del usuario
 * @property {string} date - Fecha de la ruta histórica
 * @property {string[]} route - Ruta histórica
 *
 */
const UsersSchema = new Schema<UsersDocumentInterface>({

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

  activities: { 
    type: String, 
    default: "bicicleta",
    enum: ["bicicleta", "correr"] 
  },

  friends: { 
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  },

  groups: { 
    type: [Schema.Types.ObjectId],
    ref: 'Group',
    required: true
  },

  stats: { 
    type: [[Number, Number], [Number, Number], [Number, Number]], 
    required: true 
  },

  favRoutes: { 
    type: [Schema.Types.ObjectId],
    ref: 'Track',
    required: true
  },

  activeChallenges: { 
    type: [Schema.Types.ObjectId],
    ref: 'Challenge',
    required: true
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

export const Users = model<UsersDocumentInterface>('User', UsersSchema);