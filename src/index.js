const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const keys = require('./keys');
const passport = require('passport');

const {database} = require('./keys')

//inicializaciones
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
const hbs = exphbs.create({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layout"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require('./lib/handlebars')
  });
  app.engine(".hbs", hbs.engine);
  app.set("view engine", ".hbs");


//midlewares
app.use(session({
  secret: "ferfrontweb",
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req, res, next) =>{
  app.locals.success = req.flash('success')
  app.locals.message = req.flash('message')
  app.locals.user = req.user;
  next();
});

//Routes.
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));


//Public
app.use(express.static(path.join(__dirname, 'public')))

//starting server
app.listen(app.get('port'), () =>{
    console.log('server on port', app.get('port'))
});


