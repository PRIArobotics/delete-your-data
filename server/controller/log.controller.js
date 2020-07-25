import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Log } from '../../models';

module.exports.name = 'Log';

export async function create({ user_id, savelocation }) {
  // validate data
  if (!user_id) {
    throw new httpErrors[400]('`user_id` can not be empty!');
  }

  if (!savelocation) {
    throw new httpErrors[400]('`savelocation` can not be empty!');
  }

  // save to database
  try {
    const log = await Log.create({ user_id, savelocation });
    return log;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll({}) {
  // create filter
  var condition = name ? {} : null;

  // query database
  try {
    const log = await Log.findAll({ where: condition });
    return log;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readByUserID({ user_id }) {
  // create filter
  var condition = user_id ? { user_id: { [Op.like]: `%${user_id}%` } } : null;

  // query database
  try {
    const log = await Log.findAll({ where: condition });
    return log;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(id) {
  // query database
  try {
    const log = await Log.findByPk(id);
    return log;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function update(id, { user_id, savelocation }) {
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
    [num] = await Log.update(
      { user_id, savelocation },
      {
        where: { id },
      },
    );
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Updating Log with ID=${id} failed`);
  }

  return { message: 'Log was updated successfully.' };
}

export async function del(id) {
  // save to database
  let num;
  try {
    num = await Log.destroy({
      where: { id },
    });
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Deleting Log with ID=${id} failed`);
  }

  return { message: 'Log was deleted successfully.' };
}
