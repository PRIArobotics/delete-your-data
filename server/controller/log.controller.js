import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Log } from '../../models';

module.exports.name = 'Log';

export async function create({ account_uuid, native_location }) {
  // validate data
  if (!account_uuid) {
    throw new httpErrors[400]('`account_uuid` can not be empty!');
  }

  if (!native_location) {
    throw new httpErrors[400]('`native_location` can not be empty!');
  }

  // save to database
  try {
    const log = await Log.create({ account_uuid, native_location });
    return log;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll() {
  // query database
  try {
    const log = await Log.findAll();
    return log;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAllByAccount(account_uuid) {
  // query database
  try {
    const logs = await Log.findAll({
      where: { account_uuid },
    });
    return logs;
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

export async function update(id, { account_uuid, native_location }) {
  // validate data
  if (!account_uuid) {
    throw new httpErrors[400]('`account_uuid` can not be empty!');
  }

  if (!native_location) {
    throw new httpErrors[400]('`native_location` can not be empty!');
  }

  // save to database
  let num;
  try {
    // update returns one or two numbers (usually one, except for special circumstances:
    // https://sequelize.org/v5/class/lib/model.js~Model.html#static-method-update)
    // we want the first of those numbers, i.e. do an array destructuring assignment here:
    [num] = await Log.update(
      { account_uuid, native_location },
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
