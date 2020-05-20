const { Login, FindUser, findByEmail} = require('../models/users')
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

const getUser = ({username}) => {
  return FindUser(username)
    .then(r => {
        console.log(r);
      return r;
    })
    .catch(e => {
      return e;
    })
}

const fileUpload  = async ({data})=>{
  data = new Site(data);
  var d = await data.save();
  
  return d;
  // return "Site data uploaded successfully";
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
  fileUpload

}

module.exports = root;
