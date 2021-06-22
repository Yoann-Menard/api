const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation } = require('../validation');

// Récupère tous les users jusqu'à 15 maximum
router.get('/', async (req, res) => {
  try {
    const users = await User.find().limit(15);
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

// router.post('/register', async (req, res) => {
  //   const user = new User({
  //     name: req.body?.name,
  //     email: req.body?.email,
  //     password: req.body?.password,
  //     presentation: req.body?.presentation,
//   });

//   try {
//     const savedUser = await user.save();
//     res.json(savedUser);
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    console.log('data is being sent to mongoDB database...');
    User.create({
      name: req.body?.name,
      email: req.body?.email,
      password: req.body?.password,
      presentation: req.body?.presentation,
    }).then((user) => res.json(user));
  }
});

// router.post('/login', async (req, res) => {
//   // Crée et assigne un token
//   const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
//   res.header('auth-token', token).send(token);
// });

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

function loginValidation(body) {
  throw new Error('Function not implemented.');
}
module.exports = router;
