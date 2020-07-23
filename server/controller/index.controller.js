const httpErrors = require('httperrors');

const db = require('../../models');

const Op = db.Sequelize.Op;

module.exports.name = 'Index';

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

module.exports.readAll = (req, res) => {};

module.exports.read = (req, res) => {};

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

  module.exports.delete = async (user_id) => {
    // save to database
    let num;
    try {
      num = await db.Index.destroy({
        where: { user_id },
      });
    } catch (err) {
      throw new httpErrors[500](err.message || 'An error occurred...');
    }
  
    if (num !== 1) {
      throw new httpErrors[400](`Deleting Index with UserID=${user_id} failed`);
    }
  
    return { message: 'Index was deleted successfully.' };
  };