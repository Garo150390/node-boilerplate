const passport = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const nconf = require('../config');
const passportJwt = require('../passport/strategies/passport-jwt.js');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: nconf.get('jwt:secret'),
};

passport.use(new JwtStrategy(opts, passportJwt));
