const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('mongoose').model('User');

passport.use(new JwtStrategy());
