const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');
const { Mongoose } = require('mongoose');

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config

require('./config/passport')(passport);

connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Method override
app.use(methodOverride(function(req, res) {
    if(req.body && typeof req.body == 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));


// Handlebars Helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs');
const { type } = require('os');


// Handlebars, view engine
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
    },
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

// Sessions 
app.use(session({
    secret: 'key',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Passports middleware 
app.use(passport.initialize())
app.use(passport.session())

// Set global variables
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next();
})

// Static folder

app.use(express.static(path.join(__dirname, 'public')));

// Routes

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 5000;

app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))