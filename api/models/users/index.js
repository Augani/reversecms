var User = require('./user.model');
var Bcrypt = require('bcryptjs')




const FindUser = async function(username){
    return new Promise((resolve, reject)=>{
        User.find({username}, function(err,result){
            if(err)return reject(err);
            resolve(result[0]);
        })
      })
   
}

const findByEmail  = async email =>{
    return new Promise((resolve, reject)=>{
        User.find({email}).exec(async function(err, doc){
            if(err || !doc.length)reject(0);
            resolve(doc[0]);
        })
    })
}

const Login = function(user){
    return new Promise(function(resolve, reject){
      User.find({username: user.username}).exec(async function(err, doc) { 
          if(err || !doc.length){
              var g = await findByEmail(user.username).then(y=>y).catch(e=>e);
              if(g == 0)return reject('User not found')
              doc.push(g);
          }
          if(!Bcrypt.compareSync(user.password, doc[0].password)) return reject('User password incorrect');
          doc[0].active = true;
          await doc[0].save();
          resolve(doc[0]);
      });
    })
}



module.exports = { FindUser, Login, findByEmail}