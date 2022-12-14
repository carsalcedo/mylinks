const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../dababase');
const helpers = require('../lib/helpers');
const { post } = require('../routes');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) =>{
        console.log(req.body)
       const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
       if(rows.length > 0){
           const user = rows[0];
           const validPassword = await helpers.matchPassword(password, user.password)
           if(validPassword){
            done(null, user, req.flash('success', 'welcome' + user.username));
           } else{
            done(null, false, req.flash('message', 'Incorrect password'));
           }
       }else{
        return done(null, false, req.flash('message', 'username does not exist'))
       }
    }
))

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) =>{
    const {fullname} = req.body;
    const newUser={
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
  } 
));

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done) =>{
   const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
   done(null, rows[0]);
});