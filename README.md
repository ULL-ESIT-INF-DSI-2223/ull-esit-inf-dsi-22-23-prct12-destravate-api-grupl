# Práctica 12 - API REST DESTRAVATE

Alberto Zarza Martín *alu0101412993@ull.edu.es*
Ismael Martín Herrera *alu0101397375@ull.edu.es*

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupl/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupl?branch=main)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct12-destravate-api-grupl&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct12-destravate-api-grupl)


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
"dev": "tsc-watch --onSuccess \"env-cmd -f ./config/dev.env node dist/index.js\""

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

En este sentido, se ha definido un directorio ```routers```, en el que se encuentran los ficheros ```user.js```, ```track.js```, ```group.js``` y ```challenge.js```, cada uno dentro de su correspondiente subcarpeta, que contienen las distintas rutas y operaciones CRUD que se pueden realizar sobre cada uno de los objetos de la aplicación Destravate. Como por ejemplo, en el fichero ```user.js``` se encuentran las siguientes rutas y operaciones CRUD:

```ts
export const usersRouter = express.Router();


usersRouter.post('/users', async (req, res) => {

  try {

      const arrayUsers = req.body.friends;
      const arrayIdFriendsUsers = [];
      
      for (let i = 0; i < arrayUsers.length; i++) {
        const user = await Users.findOne({id: arrayUsers[i]});
        if (!user) {
          return res.status(404).send({
            error: "User not found",
            user: user
          });
        }
        arrayIdFriendsUsers.push(user._id);
      }
    
      // check if the groups of the user exist
      const arrayGroups = req.body.groups;
      const arrayIdGroups = [];
    
      for (const group_ of arrayGroups) {
        const group = await GroupsModel.findOne({id: group_});
        if (!group) {
          return res.status(404).send({
            error: "Group not found",
            group: group
          });
        }
        arrayIdGroups.push(group._id);
      }


    
      // Check if the favourite routes of the user exist
      const arrayRoutes = req.body.favRoutes;
      const arrayIdRoutes = [];
    
      for (const route_ of arrayRoutes) {
        const route = await Track.findOne({id: route_});
        if (!route) {
          return res.status(404).send({
            error: "Route not found",
            route: route
          });
        }
        arrayIdRoutes.push(route._id);
      }

      // Check if the challenges of the user exist
      const arrayChallenges = req.body.activeChallenges;
      const arrayIdChallenges = [];
    
      for (const challenge_ of arrayChallenges) {
        const challenge = await Challenges.findOne({id: challenge_});
        if (!challenge) {
          return res.status(404).send({
            error: "Challenge not found",
            challenge: challenge
          });
        }
        arrayIdChallenges.push(challenge._id);
      }
  
      const user_ = new Users({
        ...req.body,
        friends: arrayIdFriendsUsers,
        groups: arrayIdGroups,
        favRoutes: arrayIdRoutes,
        activeChallenges: arrayIdChallenges
      });
    const userMessage = await user_.save();
    // Añadir el usuario a sus amigos
    for(const friend of user_.friends) {
      await Users.findOneAndUpdate({_id: friend}, {$push: {friends: user_._id}});
    }
    // Añadir el usuario de los grupos
    for (const group of user_.groups) {
      await GroupsModel.findOneAndUpdate({_id: group}, {$push: {participants: user_._id}});
    }

    // Añadir de las rutas favoritas
    for (const route of user_.favRoutes) {
      await Track.findOneAndUpdate({_id: route}, {$push: {users: user_._id}});
    }

    // Añadir de los retos activos
    for (const challenge of user_.activeChallenges) {
      await Challenges.findOneAndUpdate({_id: challenge}, {$push: {idUsersChallenge: user_._id}});
    }
    return res.status(201).send(userMessage);
  }
  catch(error) {
    return res.status(500).send(
      {
        error: error.message,
        stack: error.stack
      }
    );
  }
});


usersRouter.get('/users', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};
  try{
    const user = await Users.findOne(filter).populate([
      {path: 'friends', select: ['name']},
      {path: 'groups', select: ['name']}, 
      {path: 'favRoutes', select: ['name']}, 
      {path: 'activeChallenges', select: ['name']}
    ]);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send();
    }
  }
  catch{
    res.status(500).send();
  }
});


 
usersRouter.get('/users/:id', async(req, res) => {
  const filter = req.params.id?{id: Number(req.params.id)}:{};

  try{
    const user = await Users.find(filter).populate([
    {path: "friends", select: "name"}, 
    {path: "groups", select: "name"}, 
    {path: "favRoutes", select: "name"}, 
    {path: "activeChallenges", select: "name"}
    ]);
    if (user.length !== 0) {
      res.send(user);
    } else {
      res.status(404).send();
    }
  }
  catch{
    res.status(500).send();
  }
});

usersRouter.patch('/users', async(req, res) => {


  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    const allowedUpdates = ['id', 'name', 'activities', 'friends', 'groups', 'stats', 'favRoutes', 'activeChallenges', 'historic'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {

      if (req.body.friends){
        const arrayUsers = [];
        for (const friend of req.body.friends) {
          const user = await Users.findOne({id: friend});
          if (!user) {
            return res.status(404).send({
              error: "User not found",
              user: user
            });
          }
          arrayUsers.push(user._id);
        }
        req.body.friends = arrayUsers;
      }

      if (req.body.groups){
        const arrayGroups = [];
        for (const group_ of req.body.groups) {
          const group = await GroupsModel.findOne({id: group_});
          if (!group) {
            return res.status(404).send({
              error: "Group not found",
              group: group
            });
          }
          arrayGroups.push(group._id);
        }
        req.body.groups = arrayGroups;
      }

      if(req.body.favRoutes){
        const arrayRoutes = [];
        for (const route_ of req.body.favRoutes) {
          const route = await Track.findOne({id: route_});
          if (!route) {
            return res.status(404).send({
              error: "Route not found",
              route: route
            });
          }
          arrayRoutes.push(route._id);
        }
        req.body.favRoutes = arrayRoutes;
      }

      if(req.body.activeChallenges){
        const arrayChallenges = [];
        for (const challenge_ of req.body.activeChallenges) {
          const challenge = await Challenges.findOne({id: challenge_});
          if (!challenge) {
            return res.status(404).send({
              error: "Challenge not found",
              challenge: challenge
            });
          }
          arrayChallenges.push(challenge._id);
        }
        req.body.activeChallenges = arrayChallenges;
      }   
      try{
        const user = await Users.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
          new: true,
          runValidators: true,
        });
        if (!user) {
          return res.status(405).send();
        } else {
          // Añadir el usuario a sus amigos
          if (req.body.friends){
            for(const friend of user.friends) {
              await Users.findOneAndUpdate({_id: friend}, {$push: {friends: user._id}});
            }
          }
          if (req.body.groups){
            // Añadir el usuario de los grupos
            for (const group of user.groups) {
              await GroupsModel.findOneAndUpdate({_id: group}, {$push: {participants: user._id}});
            }
          }

          if (req.body.favRoutes){
            // Añadir de las rutas favoritas
            for (const route of user.favRoutes) {
              await Track.findOneAndUpdate({_id: route}, {$push: {users: user._id}});
            }
          }
          if(req.body.activeChallenges){
            // Añadir de los retos activos
            for (const challenge of user.activeChallenges) {
              await Challenges.findOneAndUpdate({_id: challenge}, {$push: {idUsersChallenge: user._id}});
            }
          }
          return res.send(user);
        }
      }
      catch{
        return res.status(500).send();
      }
    }
  }
});    

usersRouter.patch('/users/:id', async(req, res) => {


  if (!req.params.id) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    const allowedUpdates = ['id', 'name', 'activities', 'friends', 'groups', 'stats', 'favRoutes', 'activeChallenges', 'historic'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {

      if (req.body.friends){
        const arrayUsers = [];
        for (const friend of req.body.friends) {
          const user = await Users.findOne({id: friend});
          if (!user) {
            return res.status(404).send({
              error: "User not found",
              user: user
            });
          }
          arrayUsers.push(user._id);
        }
        req.body.friends = arrayUsers;
      }

      if (req.body.groups){
        const arrayGroups = [];
        for (const group_ of req.body.groups) {
          const group = await GroupsModel.findOne({id: group_});
          if (!group) {
            return res.status(404).send({
              error: "Group not found",
              group: group
            });
          }
          arrayGroups.push(group._id);
        }
        req.body.groups = arrayGroups;
      }

      if(req.body.favRoutes){ 
        const arrayRoutes = [];
        for (const route_ of req.body.favRoutes) {
          const route = await Track.findOne({id: route_});
          if (!route) {
            return res.status(404).send({
              error: "Route not found",
              route: route
            });
          }
          arrayRoutes.push(route._id);
        }
        req.body.favRoutes = arrayRoutes;
      }

      if(req.body.activeChallenges){
        const arrayChallenges = [];
        for (const challenge_ of req.body.activeChallenges) {
          const challenge = await Challenges.findOne({id: challenge_});
          if (!challenge) {
            return res.status(404).send({
              error: "Challenge not found",
              challenge: challenge
            });
          }
          arrayChallenges.push(challenge._id);
        }
        req.body.activeChallenges = arrayChallenges;
      }   
      try{
        const user = await Users.findOneAndUpdate({id: req.params.id}, req.body, {
          new: true,
          runValidators: true,
        });
        if (!user) {
          return res.status(405).send();
        } else {
          // Añadir el usuario a sus amigos
          if (req.body.friends){
            for(const friend of user.friends) {
              await Users.findOneAndUpdate({_id: friend}, {$push: {friends: user._id}});
            }
          }
          if (req.body.groups){
            // Añadir el usuario de los grupos
            for (const group of user.groups) {
              await GroupsModel.findOneAndUpdate({_id: group}, {$push: {participants: user._id}});
            }
          }

          if (req.body.favRoutes){
            // Añadir de las rutas favoritas
            for (const route of user.favRoutes) {
              await Track.findOneAndUpdate({_id: route}, {$push: {users: user._id}});
            }
          }
          if(req.body.activeChallenges){
            // Añadir de los retos activos
            for (const challenge of user.activeChallenges) {
              await Challenges.findOneAndUpdate({_id: challenge}, {$push: {idUsersChallenge: user._id}});
            }
          }
          return res.send(user);
        }
      }
      catch{
        return res.status(500).send();
      }
    }
  }
});    

usersRouter.delete('/users/', async(req, res) => {

  const filter = req.query.name?{name: req.query.name.toString()}:{};
  
  try{ 
    const user = await Users.findOne(filter);
    if (!user) {
      return res.status(404).send();
    } 
    
    // ELiminar de los amigos
    for (const friend of user.friends) {
      await Users.findOneAndUpdate({_id: friend}, {$pull: {friends: user._id}});
    } 
    
    // Eliminar el usuario de los grupos
    for (const group of user.groups) {
      await GroupsModel.findOneAndUpdate({_id: group}, {$pull: {participants: user._id}});
    }

    // Eliminar de las rutas favoritas
    for (const route of user.favRoutes) {
      await Track.findOneAndUpdate({_id: route}, {$pull: {users: user._id}});
    }

    // Eliminar de los retos activos
    for (const challenge of user.activeChallenges) {
      await Challenges.findOneAndUpdate({_id: challenge}, {$pull: {idUsersChallenge: user._id}});
    }

    //await user.deleteOne();
    await Users.findOneAndDelete(filter);
    
    return res.send(user);
    
  }
  catch(error){
    return res.status(500).send(error);
  }
});

usersRouter.delete('/users/:id', async(req, res) => {

  const filter = req.params.id?{id: req.params.id}:{};
  
  try{ 
    const user = await Users.findOne(filter);
    if (!user) {
      return res.status(404).send();
    } 
    
    // ELiminar de los amigos
    for (const friend of user.friends) {
      await Users.findOneAndUpdate({_id: friend}, {$pull: {friends: user._id}});
    } 
    
    // Eliminar el usuario de los grupos
    for (const group of user.groups) {
      await GroupsModel.findOneAndUpdate({_id: group}, {$pull: {participants: user._id}});
    }

    // Eliminar de las rutas favoritas
    for (const route of user.favRoutes) {
      await Track.findOneAndUpdate({_id: route}, {$pull: {users: user._id}});
    }

    // Eliminar de los retos activos
    for (const challenge of user.activeChallenges) {
      await Challenges.findOneAndUpdate({_id: challenge}, {$pull: {idUsersChallenge: user._id}});
    }

    //await user.deleteOne();
    await Users.findOneAndDelete(filter);
    
    return res.send(user);
    
  }
  catch(error){
    return res.status(500).send(error);
  }
});
```



## Relaciones entre objetos

En esta sección se describen las relaciones entre los distintos objetos de la aplicación Destravate, así como las operaciones CRUD que se pueden realizar sobre cada uno de ellos.

En primer lugar, los Usuarios pueden tener amigos, participar en grupos, tener rutas favoritas y retos activos, por tanto se establecen las siguientes relaciones:

- Al añadir un usuario, debe comprobarse que los amigos que se le añaden existen en la base de datos, y en caso contrario, se debe devolver un error. Además, se debe añadir el usuario a la lista de amigos de los usuarios que se le añaden.
- Al añadir un usuario, debe comprobarse que los grupos en los que participa existen en la base de datos, y en caso contrario, se debe devolver un error.
- Al añadir un usuario, debe comprobarse que las rutas favoritas existen en la base de datos, y en caso contrario, se debe devolver un error.
- Al actualizar un usuario, se deben realizar las mismas comprobaciones que en el caso anterior.
- Al eliminar un usuario, se deben eliminar todas las referencias a este en los grupos, rutas favoritas y retos activos.

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
  ];
}
```


Para hacer todo lo anterior cabe resaltar el uso de los operadores `$push` y `$pull` de Mongoose, que permiten añadir y eliminar elementos de un array respectivamente. Por ejemplo, a continuación un fragmento de código del patch donde se actualizan también las rutas, grupos y retos:

```ts
         if (req.body.friends){
            for(const friend of user.friends) {
              await Users.findOneAndUpdate({_id: friend}, {$push: {friends: user._id}});
            }
          }
          if (req.body.groups){
            // Añadir el usuario de los grupos
            for (const group of user.groups) {
              await GroupsModel.findOneAndUpdate({_id: group}, {$push: {participants: user._id}});
            }
          }

          if (req.body.favRoutes){
            // Añadir de las rutas favoritas
            for (const route of user.favRoutes) {
              await Track.findOneAndUpdate({_id: route}, {$push: {users: user._id}});
            }
          }
          if(req.body.activeChallenges){
            // Añadir de los retos activos
            for (const challenge of user.activeChallenges) {
              await Challenges.findOneAndUpdate({_id: challenge}, {$push: {idUsersChallenge: user._id}});
            }
          }
```

En segundo lugar, los grupos pueden tener participante y rutas favoritas, por tanto se establece la siguiente relación:

- Al añadir un grupo, debe comprobarse que los participantes que se le añaden existen en la base de datos, y en caso contrario, se debe devolver un error.
- Al añadir un grupo, debe comprobarse que las rutas favoritas existen en la base de datos, y en caso contrario, se debe devolver un error.
- Al actualizar un grupo, en caso de añadir un usuario al grupo, debe realizarse por un lado la comprobación de que esos nuevos usuarios existen, y por otro lado, añadir el grupo a la lista de grupos de los usuarios.
- Al eliminar un grupo, se debe eliminar el citado grupo de la lista de grupos de los usuarios que participan en él.

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
```

En tercer lugar, en cuanto a las rutas, estas pueden tener usuarios que las frecuentan, por tanto se establece la siguiente relación:

- Al añadir una ruta, debe comprobarse que los usuarios que la frecuentan existen en la base de datos, y en caso contrario, se debe devolver un error. Además, se debe añadir la ruta a la lista de rutas favoritas de los usuarios que la frecuentan.
- Al actualizar una ruta, se deben realizar las mismas comprobaciones que en el caso anterior.
- Al eliminar una ruta, se deben eliminar todas las referencias a esta en los usuarios que la frecuentan.

```ts
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
```

En cuarto lugar, los retos pueden tener usuarios que los tienen activos, por tanto se establece la siguiente relación:

- Al añadir un reto, debe comprobarse que los usuarios que lo tienen activo existen en la base de datos, y en caso contrario, se debe devolver un error. Además, se debe añadir el reto a la lista de retos activos de los usuarios que lo tienen activo.
- Al actualizar un reto, se deben realizar las mismas comprobaciones que en el caso anterior.
- Al eliminar un reto, se deben eliminar todas las referencias a este en los usuarios que lo tienen activo.

```ts
export interface ChallengeDocumentInterface extends Document {
  id: number;
  name: string;
  ruteChallenge: TrackDocumentInterface[];
  typeActivitie: "bicicleta" | "correr";
  kmTotal: number;
  idUsersChallenge: UsersDocumentInterface[];

}
```

## Conclusión

A modo de conclusión, una vez llevado a cabo todo el desarrollo descrito previamente y con las correspondientes herramientas, hemos obtenido una API REST funcional, que permite realizar las operaciones CRUD sobre los distintos objetos de la aplicación Destravate, y que además se encuentra desplegada en la nube, concretamente en Atlas MongoDB.

Desde nuestro punto de vista este proyecto aunque si bien tiene complejidad, ha sido muy interesante, puesto que nos ha permitido poner en práctica los conocimientos adquiridos en la asignatura de Desarrollo de Sistemas Informáticos, y además nos ha permitido aprender nuevas tecnologías como son MongoDB y Mongoose. Y además de permitirnos ver nuestro trabajo desplegado en la nube y totalmente funcional.

## Referencias

[1 Guión de la práctica](https://ull-esit-inf-dsi-2223.github.io/prct12-destravate-api/)
[2 Apuntes de la asignatura](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/)

