import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Account } from '../../models';

export async function create({ pluginUuid, nativeId }) {
  // validate data
  if (!pluginUuid) {
    throw new httpErrors[400]('`pluginUuid` can not be empty!');
  }

  if (!nativeId) {
    throw new httpErrors[400]('`nativeId` can not be empty!');
  }

  // save to database
  try {
    const account = await Account.create({ pluginUuid, nativeId });
    return account;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll({ personUuid, pluginUuid }) {
  // create filter
  const condition = {};
  if (personUuid) condition.personUuid = personUuid;
  if (pluginUuid) condition.pluginUuid = pluginUuid;

  // query database
  try {
    const accounts = await Account.findAll({ where: condition });
    return accounts;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(uuid) {
  // query database
  try {
    const account = await Account.findByPk(uuid);
    return account;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function update(uuid, { nativeId }) {
  // validate data
  if (!nativeId) {
    throw new httpErrors[400]('`nativeId` can not be empty!');
  }

  // save to database
  let num;
  try {
    // update returns one or two numbers (usually one, except for special circumstances:
    // https://sequelize.org/v5/class/lib/model.js~Model.html#static-method-update)
    // we want the first of those numbers, i.e. do an array destructuring assignment here:
    [num] = await Account.update(
      { nativeId },
      {
        where: { uuid },
      },
    );
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Updating Account with UUID=${uuid} failed`);
  }

  return { message: 'Account was updated successfully.' };
}

export async function del(uuid) {
  // save to database
  let num;
  try {
    num = await Account.destroy({
      where: { uuid },
    });
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Deleting Account with UUID=${uuid} failed`);
  }

  return { message: 'Account was deleted successfully.' };
}
