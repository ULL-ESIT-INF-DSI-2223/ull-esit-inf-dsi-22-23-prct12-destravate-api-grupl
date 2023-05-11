# Práctica 12 - API REST DESTRAVATE

Alberto Zarza Martín *alu0101412993@ull.edu.es*
Ismael Martín Herrera *alu0101397375@ull.edu.es*

## Índice 

1. [Introducción](#introducción)
2. [Implementación del servidor](#implementación-del-servidor)
3. [Estructura del desarrollo](#estructura-del-desarrollo)
4. [Relaciones entre objetos](#relaciones-entre-objetos)
5. [Conclusión](#conclusión)
6. [Referencias](#referencias)


## Introducción

En este última práctica de la asignatura de DSI, se ha propuesto el desarrollo en grupo de una API REST para aplicación Destravate. Esta aplicación consiste en un registro deportivo. En este sentido, la misma permite registrar usuarios, grupos de usuarios, retos activos y rutas disponibles. 

Para el desarrollo de esta API, hemos hecho uso de los siguientes recursos:

- Servidor Express, mediante el correspondiente módulo ```express```.
- Base de datos MongoDB, en este sentido, en vez de utilizar directamente el driver de MongoDB, hemos hecho uso del módulo ```mongoose```.
- SuperTest, para la realización de las pruebas de la API de una manera más sencilla y sin necesidad de que el servidor ```express``` esté en ejecución.
- Atlas MongoDB, para el despliegue de la base de datos en la nube.
- Cyclic 
- Integración continua mediante GitHub Actions, para la integración con Coveralls y SonarCloud.


## Implementación del servidor

Para la implementación del servidor tal y como se ha indicado en el apartado anterior hemos hecho uso de un servidor Express, el cual se encuentra en el fichero ```app.ts```. En este sentido, el servidor se encuentra configurado para que escuche en el puerto indicado mediante la variable de entorno ```process.env.PORT``` , y además, se ha configurado para que acepte peticiones de tipo JSON.

```ts
const app = express();
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
```

Por otro lado, para la implementación de los distintos endpoints de la API, hemos hecho uso de los distintos routers que se encuentran en la carpeta ```routers```. En este sentido, cada uno de estos routers se encarga de gestionar las peticiones que llegan a la API, y de realizar las operaciones correspondientes sobre la base de datos, correspondiente al tipo de objeto que gestiona dicho router, por ejemplo un Usuario o una Ruta. En este sentido, en el fichero ```index.ts``` se indica al servidor que utilice los distintos routers que se encuentran en la carpeta ```routers```, tal y como se muestra a continuación:

```ts
app.use(usersRouter);
app.use(trackRouter);
app.use(challengesRouter);
app.use(groupsRouter);
app.use(defaultRouter);
```

Por otra parte, para la conexión con la base de datos, hemos hecho uso del módulo ```mongoose```. En este sentido, para la conexión con la base de datos, hemos hecho uso de la variable de entorno ```process.env.MONGODB_URL```, la cual contiene la URL de conexión con la base de datos. Además, para la conexión con la base de datos, hemos hecho uso de la función ```connect```, la cual recibe como parámetro la URL de conexión. 

```ts
connect('mongodb://127.0.0.1:27017/destravate').then(() => {
  console.log('Connection to MongoDB server established');
}).catch(() => {
  console.log('Unable to connect to MongoDB server');
});
```

Finalmente, cabe destacar que para la realización de las pruebas de la API, hemos diferenciado las bases de datos, por lo que tenemos una base de datos ```destravate``` para el desarrollo, y otra base de datos ```destravate-test``` para las pruebas. En este sentido, para la conexión con la base de datos de pruebas, hemos hecho uso de la variable de entorno ```process.env.MONGODB_URL_TEST```, la cual contiene la URL de conexión con la base de datos de pruebas, además de configurar en los comandos ```npm run test``` y ```npm run dev1```, añadiendo lo siguiente ```env-cmd -f ./config/dev.env``` para que según lo que se esté ejecutando, se conecte a una base de datos u otra.

Quedando de la siguiente manera:

```ts
"dev1": "tsc-watch --onSuccess \"env-cmd -f ./config/dev.env node dist/index.js\""

"env-cmd -f ./config/test.env mocha --exit"
```


## Estructura del desarrollo

Una vez descrito el funcionamiento del servidor, pasamos a describir la estructura del desarrollo de la API. En este sentido, hemos hecho uso de los siguientes directorios:

- ```models```: En este directorio se encuentran los modelos de los distintos objetos de la aplicación Destravate. En este sentido, cada uno de estos modelos se encuentra en un fichero distinto, y además, cada uno de estos ficheros contiene la definición del modelo y el schema correspondiente. 

En primer lugar, el modelo de un usuario se encuentra en el fichero ```users.js```, y contiene la definición del modelo y el schema correspondiente, tal y como se muestra a continuación:

```ts
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
  ]


}

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
```

En segundo lugar, el modelo de una ruta se encuentra en el fichero ```track.js```, y contiene la definición del modelo y el schema correspondiente, tal y como se muestra a continuación:

```ts
export type Actividad = "bicicleta" | "correr";
export type GeoLocalization = [number, number]


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
```

En tercer lugar, el modelo de un grupo se encuentra en el fichero ```group.js```, y contiene la definición del modelo y el schema correspondiente, tal y como se muestra a continuación:

```ts
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
    ref: 'User',
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
```

En cuarto lugar, el modelo de un reto se encuentra en el fichero ```challenge.js```, y contiene la definición del modelo y el schema correspondiente, tal y como se muestra a continuación:

```ts
export interface ChallengeDocumentInterface extends Document {
  id: number;
  name: string;
  ruteChallenge: TrackDocumentInterface[];
  typeActivitie: "bicicleta" | "correr";
  kmTotal: number;
  idUsersChallenge: UsersDocumentInterface[];

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
  idUsersChallenge: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true
  }
});

export const Challenges = model<ChallengeDocumentInterface>('Challenge', ChallengeSchema);
```

Por otra parte, una vez definidos los distintos modelos de la aplicación, se procede a definir las distintas rutas que se pueden realizar sobre la API REST, así como las operaciones CRUD que se pueden realizar sobre cada uno de los objetos de la aplicación Destravate.

En este sentido, se ha definido un directorio ```routers```, en el que se encuentran los ficheros ```user.js```, ```track.js```, ```group.js``` y ```challenge.js```, cada uno dentro de su correspondiente subcarpeta, que contienen las distintas rutas y operaciones CRUD que se pueden realizar sobre cada uno de los objetos de la aplicación Destravate. Como 



## Relaciones entre objetos

En esta sección se describen las relaciones entre los distintos objetos de la aplicación Destravate, así como las operaciones CRUD que se pueden realizar sobre cada uno de ellos.

## Conclusión

A modo de conclusión, una vez llevado a cabo todo el desarrollo descrito previamente y con las correspondientes herramientas, hemos obtenido una API REST funcional, que permite realizar las operaciones CRUD sobre los distintos objetos de la aplicación Destravate, y que además se encuentra desplegada en la nube, concretamente en Atlas MongoDB.

## Referencias