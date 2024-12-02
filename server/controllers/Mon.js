const models = require('../models');
const { Mon } = models;

const builderPage = async (req, res) => res.render('app');

const buildTeam = async (req, res) => {
    if(!req.body.efforts || !req.body.level) {
        return res.status(400).json({ error: 'Both effort values and level are required!' });
    }
};