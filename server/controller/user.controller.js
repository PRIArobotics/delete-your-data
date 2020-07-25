import httpErrors from 'httperrors';

import * as db from '../../models';

const Op = db.Sequelize.Op;

module.exports.name = 'User';

export async function create({ plugin_uuid, native_id }) {
  // validate data
  if (!plugin_uuid) {
    throw new httpErrors[400]('`plugin_uuid` can not be empty!');
  }

  if (!native_id) {
    throw new httpErrors[400]('`native_id` can not be empty!');
  }

  // save to database
  try {
    const user = await db.User.create({ plugin_uuid, native_id });
    return user;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll({}) {
  // create filter
  var condition = name ? {} : null;

  // query database
  try {
    const user = await db.User.findAll({ where: condition });
    return user;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readByUuid({ uuid }) {
  // create filter
  var condition = uuid ? { uuid: { [Op.like]: `%${uuid}%` } } : null;

  // query database
  try {
    const user = await db.User.findAll({ where: condition });
    return user;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(id) {
  // query database
  try {
    const user = await db.User.findByPk(id);
    return user;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function update(id, { plugin_id, native_id }) {
  // validate data
  if (!plugin_id) {
    throw new httpErrors[400]('`plugin_id` can not be empty!');
  }

  if (!native_id) {
    throw new httpErrors[400]('`native_id` can not be empty!');
  }

  // save to database
  let num;
  try {
    // update returns one or two numbers (usually one, except for special circumstances:
    // https://sequelize.org/v5/class/lib/model.js~Model.html#static-method-update)
    // we want the first of those numbers, i.e. do an array destructuring assignment here:
    [num] = await db.User.update(
      { plugin_id, native_id },
      {
        where: { id },
      },
    );
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Updating User with ID=${id} failed`);
  }

  return { message: 'User was updated successfully.' };
}

export async function del(uuid) {
  // save to database
  let num;
  try {
    num = await db.User.destroy({
      where: { uuid },
    });
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Deleting User with UUID=${uuid} failed`);
  }

  return { message: 'User was deleted successfully.' };
}
