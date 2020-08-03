import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Account, Log } from '../../models';

export async function create({ accountUuid, nativeLocation }) {
  // validate data
  if (!accountUuid) {
    throw new httpErrors[400]('`accountUuid` can not be empty!');
  }

  if (!nativeLocation) {
    throw new httpErrors[400]('`nativeLocation` can not be empty!');
  }

  // save to database
  try {
    const log = await Log.create({ accountUuid, nativeLocation });
    return log;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll({ accountUuid, personUuid }) {
  // create filter
  const condition = {};
  const include = [];
  if (accountUuid) condition.accountUuid = accountUuid;
  if (personUuid) {
    // TODO this adds the account to the fetched data,
    // even though we want the account only for filtering
    include.push({
      model: Account,
      where: { personUuid },
    });
  }

  // query database
  try {
    const log = await Log.findAll({ where: condition, include });
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

export async function update(id, { accountUuid, nativeLocation }) {
  // validate data
  if (!accountUuid) {
    throw new httpErrors[400]('`accountUuid` can not be empty!');
  }

  if (!nativeLocation) {
    throw new httpErrors[400]('`nativeLocation` can not be empty!');
  }

  // save to database
  let num;
  try {
    // update returns one or two numbers (usually one, except for special circumstances:
    // https://sequelize.org/v5/class/lib/model.js~Model.html#static-method-update)
    // we want the first of those numbers, i.e. do an array destructuring assignment here:
    [num] = await Log.update(
      { accountUuid, nativeLocation },
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
