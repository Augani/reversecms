let mongoose = require('mongoose')
const Bcrypt = require('bcryptjs')
const User = require('../users/user.model')
let siteSchema = new mongoose.Schema(
  {
    siteUrl: {
      type: String,
    },
    pagename:  {
      type: String,
    },
    ftpUrl:{
      type: String,
    },
    ftpUsername: String,
    ftpPassword: String,
    
    owner: Object,

  },
  { timestamps: true }
)

module.exports = mongoose.model('Sites', siteSchema)
