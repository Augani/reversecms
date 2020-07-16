var Sites = require('./site.model');
var Bcrypt = require('bcryptjs')



const deleteSite = async function({id}){
    return new Promise(async (resolve, reject)=>{
        Sites.deleteOne({_id: id}, function(err,result){
            if(err) return reject(err);
            resolve("Deleted successfully");
        })
    })
}


const FindSitesBy = async function(username){
    return new Promise((resolve, reject)=>{
       if(username.includes('root')){
        Sites.find({}, function(err,result){
            if(err)return reject(err);
            resolve(result);
        })
       }else{
        Sites.find({'owner.email': username}, function(err,result){
            if(err)return reject(err);
            resolve(result);
        })
       }
      })
   
}

const findUserBySite = async (site)=>{
    return new Promise(async (resolve, reject)=>{
        Sites.find({siteUrl: site}, function(err,result){
            if(err)return reject(err);
            resolve(result);
        })
    })
}




module.exports = { FindSitesBy, findUserBySite, deleteSite}