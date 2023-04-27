import { Document, Schema, model } from 'mongoose';


/*
ID único del usuario (puede ser un username creado por el usuario en el registro o un valor generado automáticamente por el sistema).
Nombre del usuario.
Actividades que realiza: Correr o bicicleta.
Amigos en la aplicación: Colleción de IDs de usuarios con los que interacciona.
Grupos de amigos: Diferentes colecciones de IDs de usuarios con los que suele realizar rutas.
Estadísticas de entrenamiento: Cantidad de km y desnivel total acumulados en la semana, mes y año.
Rutas favoritas: IDs de las rutas que el usuario ha realizado con mayor frecuencia.
Retos activos: IDs de los retos que el usuario está realizando actualmente.
Histórico de rutas: Los usuarios deben almacenar el historial de rutas realizadas desde que se registraron en el sistema. La información almacenada en esta estructura de datos deberá contener la información de la fecha y el ID de la ruta realizada. Nótese que un usuario puede realizar más de una ruta al día y está decisión puede afectar al tipo de estructura en el que se almacena la información.
  private id_: number;  
  private userName_: string;
  private activities_: Actividad[] = [];
  private friends_: number[] = [];
  private groups_: number[] = [];
  private stats_: stats; 
  private favouriteRoutes_: number[] = [];
  private challenges_: number[] = [];
  private historic_: historic[] = [];
*/

export type stats = [[number, number], [number, number], [number, number]];
export type historic = [string, number[]];
export type Actividad = "bicicleta" | "correr";


interface UsersDocumentInterface extends Document {

  id: number;
  userName: string; 
  activities: "bicicleta" | "correr";
  friends: number[];
  groups: number[];
  stats: [[number, number], [number, number], [number, number]];
  favRoutes: number[];
  activeChallenges: number[];
  //historicRoutes:  [number, number[]][];


}

const UsersSchema = new Schema<UsersDocumentInterface>({

  id: { 
    type: Number, 
    unique: true,
    required: true 
  },

  userName: { 
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
    type: [Number], 
    required: true 
  },

  groups: { 
    type: [Number], 
    required: true 
  },

  stats: { 
    type: [[Number, Number], [Number, Number], [Number, Number]], 
    required: true 
  },

  favRoutes: { 
    type: [Number], 
    required: true 
  },

  activeChallenges: { 
    type: [Number], 
    required: true },

  // historicRoutes: { 
  //   type: [[Number, [Number]]] , 
  //   required: true 
  // },

  
});

export const Users = model<UsersDocumentInterface>('User', UsersSchema);