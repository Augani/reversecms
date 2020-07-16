const {
  Login,
  FindUser,
  findByEmail,
  FindAllUsers,
  updateUserSites
} = require('../models/users')
const { FindSitesBy, findUserBySite, deleteSite } = require('../models/sites')
const User = require('../models/users/user.model')
const Site = require('../models/sites/site.model')
const SendEmail = require('./sendEmail')
const GetResults = require('../scrape')
const fs = require('fs')
const Editable = require('../setup')
const glob = require('glob')
const { Setup } = require('../setup')
const LoginUser = input => {
  return Login(input)
    .then(d => {
      return d
    })
    .catch(e => {
      return e
    })
}

const getAllUsers = async () => {
  return FindAllUsers()
    .then(t => {
      return t
    })
    .catch(e => {
      return e
    })
}

const getEditable = async ({ data }) => {
await Setup(data);
  const { username, pagename } = data
  var options = {
    cwd: process.cwd() + `/sites/local/${username}/${pagename}`
  }
  var f = await glob.sync('**/*.html', options)
  return new Promise((resolve) => {
    setTimeout(() => resolve(f), 2000)
    })
 
}

const removeSite = async siteId => {
  const site = await deleteSite(siteId)
  if (site) return site
  return "Couldn't delete site"
}

const getUser = async ({ username }) => {
  return FindUser(username)
    .then(r => {
      return r
    })
    .catch(e => {
      return e
    })
}

const getSitesByUser = ({ username }) => {
  return FindSitesBy(username)
    .then(r => {
      return r
    })
    .catch(e => {
      return e
    })
}

const addSite = async ({ data }) => {
  var sw = data
  var user = await findByEmail(data.username)
  data.owner = user
  data = new Site(data)
  var f = await data.save()
  var s = await updateUserSites({ email: sw.username, siteUrl: data.siteUrl })

  return f
}

const register = async ({ user }) => {
  user = new User(user)
  var d = await user.save()
  await SendEmail(user)
  return d
}

const registerWithSite = async ({ user }) => {
  const {
    username,
    email,
    password,
    url,
    ftp,
    ftpUsername,
    ftpPassword,
    pagename
  } = user
  let userdata = { username, email, password }
  const reg = await register({ user: userdata })
  const final = await addSite({
    data: {
      username: email,
      siteUrl: url,
      ftpUrl: ftp,
      pagename,
      ftpPassword,
      ftpUsername
    }
  })
  if (final) return 'User and site added successfully'
}

const updatePageData = async ({pageData, page, username, pagename}) => {
  let pagePath = process.cwd() + `/sites/local/${username}/${pagename}/${page}`;
  // console.log(pagePath)
  // let data = await fs.readFileSync(pagePath, 'utf8');
  // data = data.toString();
  // var dataTo = `<body> ${pageData} </body>`;
  // var reg = /<body>(.*)<\/body>/g;
  // var newData = data.replace(reg, 'b');
  // console.log(newData);
  let result = await fs.writeFileSync(pagePath, pageData);
  return "Page updated successFully";
}
var root = {
  login: LoginUser,
  getUser,
  register,
  getAllUsers,
  addSite,
  getSitesByUser,
  getEditable,
  removeSite,
  registerWithSite,
  updatePageData
}

module.exports = root
