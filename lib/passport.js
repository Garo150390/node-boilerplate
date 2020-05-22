const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const CustomStrategy = require('passport-custom').Strategy;

const passportJwt = require('../middleware/passport/strategies/passport-jwt.js');
const passportCustom = require('../middleware/passport/strategies/passport-custom.js');

passport.use(new JwtStrategy(passportJwt.opts, passportJwt));
passport.use('custom', new CustomStrategy(passportCustom));

module.exports = passport;
