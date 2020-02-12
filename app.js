const express = require("express");
const app = express();
const User = require("./models");

// Templates
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({ defaultLayout: "application" });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Post Data
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Session
const expressSession = require("express-session");
app.use(
  expressSession({
    resave: false,
    saveUninitialized: true,
    secret:
      process.env.SESSION_SEC || "You must generate a random session secret"
  })
);

// Flash
const flash = require("express-flash-messages");
app.use(flash());

// Passport
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {

  console.log(`passport.serializeUser() user=\n${JSON.stringify(user)}\n\n`);

  done(null, user.user_id); // Just need a unique ID here; stored in Session
});

passport.deserializeUser(function(userId, done) {

  console.log(`passport.deserializeUser() userId=:\n${userId}\n\n`);

  User.findById(userId, (err, user) => {
    console.log(`passport.deserializeUser() User.findById() callback; user=\n${JSON.stringify(user)}\nError=${err}\n\n`);
    done(err, { user_id:user.user_id, username:user.username } ); // Put whatever we want available to routes in 'req' object
  });
});

// Passport Local
const LocalStrategy = require("passport-local").Strategy;
const local = new LocalStrategy((username, password, done) => {
  User.findByUsername(username)
    .then(user => {
      console.log(`
        passport use LocalStrategy: User.findByUsername() callback; 
        user==:\n${JSON.stringify(user)}\n
        and, User.validPassword(user,password)("${password}")=${User.validPassword(user,password)}\n`);

      if (!user || !User.validPassword(user,password)) {
        done(null, false, { message: "Invalid username/password" });
      } else {
        done(null, user);
      }
    })
    .catch(e => {
      console.log(`Error: ${e}`)
      return done(null,false,e)
    });
});
passport.use("local", local);

// Routes
app.use("/", require("./routes")(passport));

// Start Server
app.listen(3000, "localhost", () => console.log("Up and Running"));
