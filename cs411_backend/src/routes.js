const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(app) {

    app.post('/api/login', function(req, res, next) {
        passport.authenticate('login', function(err, user, info) {
            try{
            if(err || !user) {
                const error = new Error("Unkown Error occurred");
                return res.json({error: 'Could not find either username or password'});
            }

            req.login(user, {session: false}, function (error) {
                if(error)
                {
                    return next(error);
                }

                const body = { uid: user.uid, username: user.username, issuer: 'npell2@illinois.edu', audience: 'imdbvisualizer.com' };
                const token = jwt.sign({user: body}, process.env.JWTSECRET, {expiresIn: '1d'});
                return res.json({ user: user.username, token: token });
            })
        } catch(error) {return next(error);}
        })(req, res, next);
    });

    app.post('/api/signup', passport.authenticate('signup', { session : false }) , async (req, res, next) => {
        req.login(req.user, {session: false}, function (error) {
            if(error)
            {
                return next(error);
            }

            const body = { uid: req.user.uid, username: req.user.username, issuer: 'npell2@illinois.edu', audience: 'imdbvisualizer.com' };

            const token = jwt.sign({user: body}, process.env.JWTSECRET, {expiresIn: '1d'});
            return res.json({ user: req.user.username, token: token });
        });
      });
}