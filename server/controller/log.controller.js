const httpErrors = require('httperrors');

const db = require('../../models');

const Op = db.Sequelize.Op;

module.exports.name = 'Log';

module.exports.create = async({ user_id, savelocation }) => {
    // validate data
  if (!user_id) {
    throw new httpErrors[400]('`user_id` can not be empty!');
  }

  if (!savelocation) {
    throw new httpErrors[400]('`savelocation` can not be empty!');
  }

  // save to database
  try {
    const index = await db.Index.create({ user_id, savelocation });
    return index;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

module.exports.readAll = async({}) => {
  // create filter
  var condition = name ? {} : null;

  // query database
  try {
    const index = await db.Index.findAll({ where: condition });
    return index;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

module.exports.readByUserID = async({ user_id }) => {
  // create filter
  var condition = user_id ? { user_id: { [Op.like]: `%${user_id}%` } } : null;

  // query database
  try {
    const index = await db.Index.findAll({ where: condition });
    return index;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

module.exports.read = async (id) => {
  // query database
  try {
    const index = await db.Index.findByPk(id);
    return index;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
};

module.exports.update = async (id, { user_id, savelocation}) => {
    // validate data
    if (!user_id) {
      throw new httpErrors[400]('`user_id` can not be empty!');
    }

    if (!savelocation) {
      throw new httpErrors[400]('`savelocation` can not be empty!');
    }

    // save to database
    let num;
    try {
      // update returns one or two numbers (usually one, except for special circumstances:
      // https://sequelize.org/v5/class/lib/model.js~Model.html#static-method-update)
      // we want the first of those numbers, i.e. do an array destructuring assignment here:
      [num] = await db.Index.update({ user_id, savelocation }, {
        where: { id },
      });
    } catch (err) {
      throw new httpErrors[500](err.message || 'An error occurred...');
    }

    if (num !== 1) {
      throw new httpErrors[400](`Updating Index with ID=${id} failed`);
    }

    return { message: 'Index was updated successfully.' };
  };

  module.exports.delete = async (id) => {
    // save to database
    let num;
    try {
      num = await db.Index.destroy({
        where: { id },
      });
    } catch (err) {
      throw new httpErrors[500](err.message || 'An error occurred...');
    }

    if (num !== 1) {
      throw new httpErrors[400](`Deleting Index with ID=${id} failed`);
    }

    return { message: 'Index was deleted successfully.' };
  };