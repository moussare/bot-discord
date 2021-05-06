const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true,unique:true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator, { message: "L'adresse mail est déjà liée à un compte" });

module.exports = mongoose.model('user', userSchema);