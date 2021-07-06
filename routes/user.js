const express = require('express');
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');
const passport = require('passport');
const passwordUtils = require('../lib/passwordUtils');

// Récupère tous les users jusqu'à 15 maximum
router.get('/', async (req, res) => {
  try {
    const users = await User.find().limit(15);
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body?.name,
    email: req.body?.email,
    password: hashedPassword,
    presentation: req.body?.presentation,
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post('/login', async (req, res) => {
  passport.authenticate('jwt', { session: false });
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send('Incorrect email or password.');
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send('Incorrect email or password.');
  }

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
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

// Edite un Utilisateur
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

// Efface un Utilisateur
router.delete('/:userId', async (req, res) => {
  try {
    const removedUser = await User.deleteOne({ _id: req.params.userId });
    res.json(removedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
