const bcrypt = require("bcrypt");

let Users = {
  '5e4325919280f51b9486d106' : {
    username: 'wlotherington243',
    passwordHash: '$2b$12$uz3GXpgzpQs1C7OLQRjYZOeCtdz6hvClMJ/PrFjOYgLI67AWcugeG',      
  }
}

const User = {
  findByUsername : username => {
    const prom = new Promise((resolve,reject)=>{
      const userId = Object.keys(Users).filter((userId)=>(Users[userId].username===username))[0];
      if (userId) {
        resolve({...Users[userId], user_id: userId});
      } else
        reject("Invalid user name");
    })
    return prom;
  },

  findById : (userId, cb) => {
    if (Users[userId])
      cb(null, Users[userId]);
    else
      cb("user ID not found",null);
  },

  validPassword : (user,password) => (
    bcrypt.compareSync(password, user.passwordHash)),

  create : (credentials) => {
    const { username, password } = credentials;
    const prom = new Promise(async (resolve,reject) => {
      await User.findByUsername(username).then(()=>{
        console.log(`*** validationError: username=${username}`)
        reject({name:"ValidationError"}); 
      })
      .catch(e=>e); 
      bcrypt.hash(password, 12, (err,passwordHash)=>{
        const user_id = Object.keys(Users).length.toString();
        resolve( Users[user_id] = {
          user_id,
          username,
          passwordHash 
        });
      })
    })
    return prom;
  }
} 

module.exports = User;
