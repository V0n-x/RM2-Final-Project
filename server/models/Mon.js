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
  level: {
    type: Number,
    min: 1,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const TeamSchema = new mongoose.Schema({
    mons: {
        type: [MonSchema],
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
    efforts: doc.efforts,
    level: doc.level,
  });

const MonModel = mongoose.model('Mon', MonSchema);
module.exports = MonModel;