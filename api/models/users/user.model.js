let mongoose = require('mongoose')
const Bcrypt = require('bcryptjs')
let userSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      unique: true,
      type: String,
      lowercase: true
    },
   
    email: {
      type: String,
      unique: true
    },
   
    password: {
      type: String,
      required: true
    },
   
  },
  { timestamps: true }
)

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = Bcrypt.hashSync(this.password, 10)
  next()
})

userSchema.methods.findSocket = function(username, cb){
    return this.find({username}).exec(cb);
}

userSchema.methods.comparePassword = function (user) {
  var self = this;
  return new Promise((resolve, reject)=>{
    var userFound = self.findOne({username:user.username}).exec((o)=>o);
    console.log(user);
    if(!userFound)reject('User doesn\'t exist');
    if(Bcrypt.compareSync(user.password, userFound.password))reject('User password invalid');
    resolve(user);
  })
  
}

module.exports = mongoose.model('User', userSchema)
