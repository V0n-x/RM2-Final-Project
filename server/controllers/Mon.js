const models = require('../models');

const { Mon } = models;

const builderPage = async (req, res) => res.render('app');

const makeMon = async (req, res) => {
  if (!req.body.species) {
    return res.status(400).json({ error: 'Species required!' });
  }

  const monData = {
    species: req.body.species,
    name: req.body.name,
    efforts: req.body.efforts,
    ivs: req.body.ivs,
    level: req.body.level,
    moves: req.body.moves,
    owner: req.session.account._id,
  };

  try {
    const newMon = new Mon(monData);
    await newMon.save();
    return res.status(201).json({
      species: newMon.species,
      name: newMon.name,
      efforts: newMon.efforts,
      ivs: newMon.ivs,
      level: newMon.level,
    });
  } catch (err) {
    return res.status(500).json({ error: 'An error occurred making mon!' });
  }
};

const getMons = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Mon.find(query).select('species name efforts ivs level').lean().exec();
    return res.json({ mons: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving mons!' });
  }
};

module.exports = {
  builderPage,
  makeMon,
  getMons,
};
