const httpErrors = require('httperrors');

const db = require('../../models');

const Op = db.Sequelize.Op;

module.exports.name = 'Plugin';

module.exports.create = async ({ name, type, config }) => {
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
};

module.exports.readAll = async ({ name }) => {
  // create filter
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  // query database
  try {
    const plugins = await db.Plugin.findAll({ where: condition });
    return plugins;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
};

module.exports.read = async (uuid) => {
  // query database
  try {
    const plugin = await db.Plugin.findByPk(uuid);
    return plugin;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
};

module.exports.update = async (uuid, { name, type, config }) => {
  // validate data
  if (!name) {
    throw new httpErrors[400]('`name` can not be empty!');
  }

  if (!type) {
    throw new httpErrors[400]('`type` can not be empty!');
  }

  // save to database
  let num;
  try {
    // update returns one or two numbers (usually one, except for special circumstances:
    // https://sequelize.org/v5/class/lib/model.js~Model.html#static-method-update)
    // we want the first of those numbers, i.e. do an array destructuring assignment here:
    [num] = await db.Plugin.update(
      { name, type, config },
      {
        where: { uuid },
      },
    );
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Updating Plugin with UUID=${uuid} failed`);
  }

  return { message: 'Plugin was updated successfully.' };
};

module.exports.delete = async (uuid) => {
  // save to database
  let num;
  try {
    num = await db.Plugin.destroy({
      where: { uuid },
    });
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Deleting Plugin with UUID=${uuid} failed`);
  }

  return { message: 'Plugin was deleted successfully.' };
};
