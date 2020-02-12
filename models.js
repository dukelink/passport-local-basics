const bcrypt = require("bcrypt");

/*
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 12);
});

const User = mongoose.model("User", UserSchema);
*/


const User = {
  findOne : user => {
    const {username} = user;
    const prom = new Promise((resolve,reject)=>{
      if (username==="wlotherington243") {
        const passwordHash = "$2b$12$uz3GXpgzpQs1C7OLQRjYZOeCtdz6hvClMJ/PrFjOYgLI67AWcugeG";
        resolve({
          _id: '5e4325919280f51b9486d106',
          username:"wlotherington243",
          passwordHash,
          validPassword : (password) => bcrypt.compareSync(password, passwordHash) // TODO: test with and without 'this'
        });
      } else
        reject("Invalid user name");
    })
    return prom;
  },
  findById : (userId, cb) => {
    if (userId==='5e4325919280f51b9486d106')
      cb(null, {
        _id: '5e4325919280f51b9486d106',
        username: 'wlotherington243',
        passwordHash: '$2b$12$uz3GXpgzpQs1C7OLQRjYZOeCtdz6hvClMJ/PrFjOYgLI67AWcugeG',      
      })
    else
      cb("user ID not found",null);
  }
}

module.exports = User;
