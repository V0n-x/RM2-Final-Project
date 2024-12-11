const mongoose = require('mongoose');
const _ = require('underscore');

const setNickname = (nickname) => _.escape(nickname).trim();

const MonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true,
    set: setNickname,
  },
  species: {
    type: String,
    required: true,
    trim: true,
  },
  //   EVs
  // https://mongoosejs.com/docs/schematypes.html#maps
  efforts: {
    type: Map,
    of: Number,
    required: true,
  },
  ivs: {
    type: [Number],
    required: true,
  },
  level: {
    type: Number,
    min: 1,
    required: true,
  },
  ability: {
    type: String,
    required: true,
    trim: true,
  },
  moves: {
    type: [String],
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

MonSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  species: doc.species,
  efforts: doc.efforts,
  ivs: doc.ivs,
  level: doc.level,
});

const MonModel = mongoose.model('Mon', MonSchema);
module.exports = MonModel;
