const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true}
});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);