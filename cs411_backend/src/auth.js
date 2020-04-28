const passport = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
var JWTStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const { mysql } = require('./db.js');
const bcrypt = require('bcrypt');
const { v1 } =  require('uuid');
require('dotenv').config();



passport.serializeUser(function(user, done) {
    console.log('Serialize user called.');
    done(null, user.name);
  });
  
  passport.deserializeUser(function(id, done) {
    console.log('Deserialize user called.');
    return done(null, {name: 'Oliver'});
  });



passport.use('signup', new LocalStrategy  ({ usernameField: 'username', password: 'password', passReqToCallback : true }, function (req, username, password, done) {

    var uuid = v1().replace('-', '').substring(0, 10);

    bcrypt.hash(password, 10, function(err, hashedpassword) {
        try {
            mysql.query(`INSERT INTO user_info(uid, username, passwordHash, firstName, lastName) VALUES ('${uuid}', '${username}', '${hashedpassword}', '${req.body.firstName}', '${req.body.lastName}')`, function (err, result) {
                if(err) { return done(err); }

                return done(null, {username: username, uid: uuid});
            });
        } catch(error) {
            return done(null, false, { errors: error });
        }
    });
}));


passport.use('login', new LocalStrategy  ({ usernameField: 'username', passwordField: 'password'}, function (username, password, done) {
    mysql.query(`SELECT username, passwordHash FROM user_info WHERE username = '${username}'`, function (err, result) {
        if (err) {throw err};
        if(result.length > 0)
        {
            
            bcrypt.compare(password, result[0].passwordHash, function(err, result) {
                if(result === true)
                {
                    return done(null, {username: username});
                }
                else {
                    return done(null, false, { errors: { "email or password": "is invalid" } })
                }
            });
        }
        else {
            return done(null, false, { errors: { "email or password": "is invalid" } })
        }
        
    });
}));



passport.use(new JWTStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWTSECRET }, async (jwt_payload, done) => {
    try {
        return done(null, jwt_payload.user);
    }
    catch (error) {
        done(error);
    }
}));