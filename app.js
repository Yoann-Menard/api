const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');

// Importation des Routes
const userRoute = require('./routes/user.js');
const memoRoute = require('./routes/memo.js');
const postitRoute = require('./routes/postit.js');

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
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('Connexion à la base de données effectuée'),
);

// Lancement de l'application sur le port 3000
app.listen(3000);
