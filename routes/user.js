const router = require('express').Router();
const User = require('../models/User');

// Récupère tous les users jusqu'à 15 maximum
router.get('/', async (req, res) => {
  try {
    const users = await User.find().limit(15);
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

// Crée un nouvel utilisateur champs nécessaire avant l'envoie: name, email, password, presentation
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    presentation: req.body.presentation,
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

// Trouve un utilisateur spécifique
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
});

// Efface un Utilisateur
router.delete('/:userId', async (req, res) => {
  try {
    const removedUser = await User.remove({ _id: req.params.userId });
    res.json(removedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

// Edite un User
router.patch('/:userId', async (req, res) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: req.params.userId },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          presentation: req.body.presentation,
        },
      },
    );
    res.json(updatedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
