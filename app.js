const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Importation des Routes
const userRoute = require('./routes/user');
const memoRoute = require('./routes/memo');
const postitRoute = require('./routes/postit');

// Gestion des routes par le Middleware
app.use('/user', userRoute);
app.use('/memo', memoRoute);
app.use('/postit', postitRoute);

// Routes
app.get('/', (req, res) => {
  res.send('Nous sommes dans la HomePage');
});

// Connexion à la Base de donnée
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => console.log('Connexion à la base de données effectuée'),
);

// Middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cors());

// Lancement de l'application sur le port 3000
app.listen(3000, () =>
  console.log("l'application est disponible sur le port 3000 !"),
);
