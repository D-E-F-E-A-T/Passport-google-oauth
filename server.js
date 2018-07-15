const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./config');
const app = express();
let googleProfile = {};

passport.serializeUser((user, done) => {
    return done(null, user);
});

passport.deserializeUser((obj, done) => {
    return done(null, obj);
});

passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        googleProfile = {
            id: profile.id,
            displayName: profile.displayName,
            img: profile,
            images: profile._json.image.url

        };
         return done(null, profile);
    }
));

app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.render('index', {user: req.user});
});

app.get('/logged', (req, res) => {
    res.render('logged', {user: googleProfile})
});

app.get('/auth/google',
  passport.authenticate('google', { scope:  ['https://www.googleapis.com/auth/plus.login']}));

  app.get('/auth/google/callback',
      passport.authenticate('google', {
          successRedirect : '/logged',
          failureRedirect: '/'
      }));


app.listen(3000);
app.use(function (req, res, next) {
    res.status(404).send('Wybacz, nie mogliśmy odnaleźć tego, czego żądasz!')
});
