var Sites = require('./site.model');
var Bcrypt = require('bcryptjs')




const FindSitesBy = async function(username){
    return new Promise((resolve, reject)=>{
        Sites.find({'owner.email': username}, function(err,result){
            if(err)return reject(err);
            resolve(result);
        })
      })
   
}




module.exports = { FindSitesBy}