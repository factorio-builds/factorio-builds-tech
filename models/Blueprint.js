const mongoose = require('mongoose');

const blueprintSchema = new mongoose.Schema({
  name: { type: String },
  desc: { type: String },
  order: { type: Number },
  hash: { type: String },
  build: { type: mongoose.Schema.Types.ObjectId, ref: 'Build' },
}, { timestamps: true });

const Blueprint = mongoose.model('Blueprint', blueprintSchema);

module.exports = Blueprint;
