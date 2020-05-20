let mongoose = require('mongoose')
const Bcrypt = require('bcryptjs')
const User = require('../users/user.model')
let siteSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      unique: true
    },
    pagename:  {
      type: String,
      unique: true
    },
    owner: Object,

  },
  { timestamps: true }
)

module.exports = mongoose.model('Sites', siteSchema)
