import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { User } from '../../models';

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
    const user = await User.create({ plugin_uuid, native_id });
    return user;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll() {
  // query database
  try {
    const users = await User.findAll();
    return users;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(id) {
  // query database
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readByUuid(uuid, plugin_uuid) {
  // query database
  try {
    const user = await User.findOne({
      where: { uuid, plugin_uuid },
    });
    return user;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAllByUuid(uuid) {
  // query database
  try {
    const users = await User.findAll({
      where: { uuid },
    });
    return users;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function update(id, { native_id }) {
  // validate data
  if (!native_id) {
    throw new httpErrors[400]('`native_id` can not be empty!');
  }

  // save to database
  let num;
  try {
    // update returns one or two numbers (usually one, except for special circumstances:
    // https://sequelize.org/v5/class/lib/model.js~Model.html#static-method-update)
    // we want the first of those numbers, i.e. do an array destructuring assignment here:
    [num] = await User.update(
      { native_id },
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

export async function updateByUuid(uuid, plugin_uuid, { native_id }) {
  // validate data
  if (!native_id) {
    throw new httpErrors[400]('`native_id` can not be empty!');
  }

  // save to database
  let num;
  try {
    // update returns one or two numbers (usually one, except for special circumstances:
    // https://sequelize.org/v5/class/lib/model.js~Model.html#static-method-update)
    // we want the first of those numbers, i.e. do an array destructuring assignment here:
    [num] = await User.update(
      { native_id },
      {
        where: { uuid, plugin_uuid },
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

export async function del(id) {
  // save to database
  let num;
  try {
    num = await User.destroy({
      where: { id },
    });
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Deleting User with UUID=${uuid} failed`);
  }

  return { message: 'User was deleted successfully.' };
}

export async function delByUuid(uuid, plugin_uuid) {
  // save to database
  let num;
  try {
    num = await User.destroy({
      where: { uuid, plugin_uuid },
    });
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Deleting User with UUID=${uuid}, plugin UUID=${plugin_uuid} failed`);
  }

  return { message: 'User was deleted successfully.' };
}
