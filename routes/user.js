const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

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
router.post(
  '/register',
  // name must be at least 6 chars long
  check('name')
    .exists()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage('must be at least 6 chars long'),
  // email must be an email
  check('email').normalizeEmail().isEmail(),
  // password must be at least 6 chars long
  check('password')
    .isLength({ min: 6 })
    .withMessage('must be at least 6 chars long')
    .matches(/\d/)
    .withMessage('must contain a number'),
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Hash le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    }).then((user) => res.json(user));
  },
);

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // verifie si l'email existe
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email or password is wrong');
  // verifie si le mot de passe est correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Invalid password');

  // Crée et assigne un token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
});

// router.post('/register', async (req, res) => {
//   const user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     presentation: req.body.presentation,
//   });

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
function loginValidation(body) {
  throw new Error('Function not implemented.');
}
