var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	seedDB = require('./seeds');

//mongoose update requirements
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//requiring routes
var commentRoutes = require('./routes/comments'),
	reviewRoutes = require('./routes/reviews'),
	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');

var url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp_review_system';
mongoose.connect(url);

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(
	require('express-session')({
		secret: 'Once again Rusty wins cutest dog!',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.listen(3000, 'localhost', function() {
	console.log('The Server Has Started!');
});
