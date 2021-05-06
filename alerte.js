const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const alerteSchema = mongoose.Schema({
  streamer: { type: String, required: true,unique:true },
  type: { type: String, required: true},
  etat: { type: Boolean, required: true }
});
alerteSchema.plugin(uniqueValidator, { message: "Vous avez déjà une alertes pour ce streamer" });
module.exports = mongoose.model('alerte', alerteSchema);