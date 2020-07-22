const httpErrors = require('httperrors');

const db = require('../../models');

const Op = db.Sequelize.Op;

module.exports.name = 'Plugin';

module.exports.create = async({ name, type, config }) => {
  // validate data
  if (!name) {
    throw new httpErrors[400]('`name` can not be empty!');
  }

  if (!type) {
    throw new httpErrors[400]('`type` can not be empty!');
  }

  // save to database
  try {
    const plugin = await db.Plugin.create({ name, type, config });
    return plugin;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

module.exports.readAll = async({ name }) => {
  // create filter
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  // query database
  try {
    const plugins = await db.Plugin.findAll({ where: condition });
    return plugins;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

module.exports.read = (req, res) => {};

module.exports.update = (req, res) => {};

module.exports.delete = (req, res) => {};

module.exports.deleteAll = (req, res) => {};
