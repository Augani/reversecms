const { Login, FindUser, findByEmail, FindAllUsers, updateUserSites} = require('../models/users')
const {FindSitesBy} = require('../models/sites')
const User  = require('../models/users/user.model');
const Site = require('../models/sites/site.model');
const SendEmail  = require('./sendEmail');
const LoginUser = input => {
  return Login(input)
    .then(d => {
      return d
    })
    .catch(e => {
      return e
    })
}

const getAllUsers = async ()=>{
  return FindAllUsers().then(t=>{
    return t
  }).catch(e=>{
    return e
  })
}

const getUser = async ({username}) => {
  return FindUser(username)
    .then(r => {
        console.log(r);
      return r;
    })
    .catch(e => {
      return e;
    })
}

const getSitesByUser = ({username})=>{
  return FindSitesBy(username)
  .then(r => {
    return r;
  })
  .catch(e => {
    return e;
  })
}

// const fileUpload  = async ({data})=>{
//   data = new Site(data);
//   var d = await data.save();
  
//   return d;
//   // return "Site data uploaded successfully";
// }

const addSite = async ({data})=>{
  var sw = data;
  var user = await findByEmail(data.username)
  data.owner = user;
  data = new Site(data);
  var f = await data.save();
  var s = await updateUserSites({email: sw.username, siteUrl: data.siteUrl})
  console.log(s)

  return f;
}

const register = async ({user}) =>{
    user = new User(user);
    var d = await user.save();
    await SendEmail(user)
    return d;
}
var root = {
  login: LoginUser,
  getUser,
  register,
  getAllUsers,
  addSite,
  getSitesByUser

}

module.exports = root;
