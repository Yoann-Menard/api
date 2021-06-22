const router = require('express').Router();
const User = require('../models/User');
const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
// const { registerValidation } = require('../validation');

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


// create application/json parser
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

//Validation
const schema = Joi.object().keys({
    name: Joi.string().min(6).required,
    email: Joi.string().min(6).email().required,
    password: Joi.string().min(8).required,
    presentation: Joi.string().min(8).required
});

router.post('/register', urlencodedParser, async (req, res) => {
   try {
        const value = await schema.validateAsync({name: req.body?.name, email: req.body?.email, password: req.body?.password, presentation: req.body?.presentation});
        console.log(value);
    } catch (err) {
        console.log(err);
    }

    //  const {error} = schema.validate({name: req.body.name, email: req.body.email, password: req.body.password, presentation: req.body?.presentation});
    //  console.log(error);
    const user = new User({
        name: req.body?.name,
        email: req.body?.email,
        password: req.body?.password,
        presentation: req.body?.presentation
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error) {
        res.send(error);
    };
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
