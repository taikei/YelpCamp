const express           = require('express');
const app               = express();
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose');
const methodOverride    = require('method-override');
const flash             = require('connect-flash');

//  IMPORTS FOR AUTHENTICATION
const passport          = require('passport');
const LocalStrategy     = require('passport-local');

// requiring DB models
const Campground        = require('./models/campground');
const Comment           = require('./models/comment');
const User              = require('./models/user');

// refreshing the data on each loading
// const seedDB            = require('./seeds');

// requiring routes
const commentRoutes     = require('./routes/comments');
const campgroundsRoutes = require('./routes/campgrounds');
const indexRoutes       = require('./routes/index');


// YELP-CAMP CONFIGURATION


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'));
app.use(flash());



// PASSPORT CONFIGURATION - authentication setup
app.use(require('express-session')({
    secret: 'I wanna be rich',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







// checking database connection
// databaseUrl = {
//      remote: mongodb+srv://taikei:5254121@cluster0.ca4ce.mongodb.net/yelpcamp?retryWrites=true&w=majority,
//      local: mongodb://localhost:27017/yelp_camp    
//}

mongoose.connect('mongodb+srv://taikei:5254121@cluster0.ca4ce.mongodb.net/yelpcamp?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection errors: '));




// seeding DB
//seedDB();



// adding session and messages(error, success) to every single route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})



// ROUTES MODULES

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


app.listen(process.env.PORT || 3000, function() {
    console.log('Server listening to port 3000!!');
});






