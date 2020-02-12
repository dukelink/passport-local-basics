const express = require("express");
const app = express();
const User = require("./models");

/*
FAILED LOGIN:
Up and Running
passport use LocalStrategy: User.findOne() callback; user==:
{
  _id: 5e4325919280f51b9486d106,
  username: 'wlotherington243',
  passwordHash: '$2b$12$uz3GXpgzpQs1C7OLQRjYZOeCtdz6hvClMJ/PrFjOYgLI67AWcugeG',
  __v: 0
}
and, use.ValidPassword("asdf")=false

SUCCESSFUL LOGIN:
passport use LocalStrategy: User.findOne() callback; user==:
{
  _id: 5e4325919280f51b9486d106,
  username: 'wlotherington243',
  passwordHash: '$2b$12$uz3GXpgzpQs1C7OLQRjYZOeCtdz6hvClMJ/PrFjOYgLI67AWcugeG',
  __v: 0
}
and, use.ValidPassword("Willie61")=true

passport.serializeUser() user=
{
  _id: 5e4325919280f51b9486d106,
  username: 'wlotherington243',
  passwordHash: '$2b$12$uz3GXpgzpQs1C7OLQRjYZOeCtdz6hvClMJ/PrFjOYgLI67AWcugeG',
  __v: 0
}


passport.deserializeUser() userId=:
5e4325919280f51b9486d106


passport.deserializeUser() User.findById() callback; user=
{
  _id: 5e4325919280f51b9486d106,
  username: 'wlotherington243',
  passwordHash: '$2b$12$uz3GXpgzpQs1C7OLQRjYZOeCtdz6hvClMJ/PrFjOYgLI67AWcugeG',
  __v: 0
}


passport.deserializeUser() userId=:
5e4325919280f51b9486d106


passport.deserializeUser() User.findById() callback; user=
{
  _id: 5e4325919280f51b9486d106,
  username: 'wlotherington243',
  passwordHash: '$2b$12$uz3GXpgzpQs1C7OLQRjYZOeCtdz6hvClMJ/PrFjOYgLI67AWcugeG',
  __v: 0
}

SIGNUP:
Up and Running
passport.serializeUser() user=
{
  _id: 5e433f8c18dec14e905af8f0,
  username: 'rloth001',
  passwordHash: '$2b$12$JzM5G.QLsRPWpUIKwx2f0.qFw4N2VgJJzsxQQv9TkOdZ7Qz0eLpoa',
  __v: 0
}


passport.deserializeUser() userId=:
5e433f8c18dec14e905af8f0


passport.deserializeUser() User.findById() callback; user=
{
  _id: 5e433f8c18dec14e905af8f0,
  username: 'rloth001',
  passwordHash: '$2b$12$JzM5G.QLsRPWpUIKwx2f0.qFw4N2VgJJzsxQQv9TkOdZ7Qz0eLpoa',
  __v: 0
}


passport.deserializeUser() userId=:
5e433f8c18dec14e905af8f0


passport.deserializeUser() User.findById() callback; user=
{
  _id: 5e433f8c18dec14e905af8f0,
  username: 'rloth001',
  passwordHash: '$2b$12$JzM5G.QLsRPWpUIKwx2f0.qFw4N2VgJJzsxQQv9TkOdZ7Qz0eLpoa',
  __v: 0
}



*/




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

// Connect to Mongoose
/*
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) next();
  else {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/passport";
    mongoose
      .connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
      .then(() => next())
      .catch(err => console.error(`Mongoose Error: ${err.stack}`));
  }
});
*/

// Passport
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {

  console.log(`passport.serializeUser() user=\n${JSON.stringify(user)}\n\n`);

  done(null, user._id); // Just need a unique ID here I guess
});

passport.deserializeUser(function(userId, done) {

  console.log(`passport.deserializeUser() userId=:\n${userId}\n\n`);

  User.findById(userId, (err, user) => {
    console.log(`passport.deserializeUser() User.findById() callback; user=\n${JSON.stringify(user)}\n\n`);
    done(err, user); // REVIEW: Should I send entire user object like this or ????
  });
});

// Passport Local
const LocalStrategy = require("passport-local").Strategy;
const local = new LocalStrategy((username, password, done) => {

console.log('**************HERE')

  User.findOne({ username })
    .then(user => {

      console.log(`passport use LocalStrategy: User.findOne() callback; user==:\n${JSON.stringify(user)}\nand, use.ValidPassword("${password}")=${user.validPassword(password)}\n`);

      if (!user || !user.validPassword(password)) {
        done(null, false, { message: "Invalid username/password" });
      } else {
        done(null, user);
      }
    })
    .catch(e => done(e));
});
passport.use("local", local);

// Routes
app.use("/", require("./routes")(passport));

// Start Server
app.listen(3000, "localhost", () => console.log("Up and Running"));
