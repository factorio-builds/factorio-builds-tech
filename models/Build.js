const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema({
  name: { type: String },
  image: { type: String },
  desc: { type: String },
  category: { type: String },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Build = mongoose.model('Build', buildSchema);

module.exports = Build;
