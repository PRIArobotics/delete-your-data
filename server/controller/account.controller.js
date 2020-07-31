import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Account } from '../../models';

module.exports.name = 'Account';

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
    const account = await Account.create({ plugin_uuid, native_id });
    return account;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll() {
  // query database
  try {
    const accounts = await Account.findAll();
    return accounts;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(id) {
  // query database
  try {
    const account = await Account.findByPk(id);
    return account;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readByUuid(person_uuid, plugin_uuid) {
  // query database
  try {
    const account = await Account.findOne({
      where: { person_uuid, plugin_uuid },
    });
    return account;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAllByUuid(person_uuid) {
  // query database
  try {
    const accounts = await Account.findAll({
      where: { person_uuid },
    });
    return accounts;
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
    [num] = await Account.update(
      { native_id },
      {
        where: { id },
      },
    );
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Updating Account with ID=${id} failed`);
  }

  return { message: 'Account was updated successfully.' };
}

export async function updateByUuid(person_uuid, plugin_uuid, { native_id }) {
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
    [num] = await Account.update(
      { native_id },
      {
        where: { person_uuid, plugin_uuid },
      },
    );
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Updating Account with ID=${id} failed`);
  }

  return { message: 'Account was updated successfully.' };
}

export async function del(id) {
  // save to database
  let num;
  try {
    num = await Account.destroy({
      where: { id },
    });
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Deleting Account with UUID=${uuid} failed`);
  }

  return { message: 'Account was deleted successfully.' };
}

export async function delByUuid(person_uuid, plugin_uuid) {
  // save to database
  let num;
  try {
    num = await Account.destroy({
      where: { person_uuid, plugin_uuid },
    });
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Deleting Account with person UUID=${person_uuid}, plugin UUID=${plugin_uuid} failed`);
  }

  return { message: 'Account was deleted successfully.' };
}
