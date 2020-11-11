import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Account, Log } from '../models';

function unpackLog(log) {
  let {
    account: { pluginUuid },
    accountUuid,
    createdAt,
    id,
    nativeLocation,
    updatedAt,
  } = log;

  return {
    pluginUuid,
    accountUuid,
    createdAt,
    id,
    nativeLocation,
    updatedAt,
  };
}

export async function create({ accountUuid, nativeLocation }) {
  const accountInclude = {
    model: Account,
    attributes: ['pluginUuid'],
  };

  // validate data
  if (!accountUuid) {
    throw new httpErrors[400]('`accountUuid` can not be empty!');
  }

  if (!nativeLocation) {
    throw new httpErrors[400]('`nativeLocation` can not be empty!');
  }

  // save to database
  try {
    const log = await Log.create({ accountUuid, nativeLocation }, { include: [accountInclude] });
    return await read(log.id);
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll({ accountUuid, personUuid, earliest, latest }) {
  // create filter
  const condition = {};
  if (accountUuid) condition.accountUuid = accountUuid;
  if (earliest || latest) {
    const createdAt = {};
    if (earliest) createdAt[Op.gte] = earliest;
    if (latest) createdAt[Op.lte] = latest;
    condition.createdAt = createdAt;
  }

  const accountInclude = {
    model: Account,
    attributes: ['pluginUuid'],
  };
  if (personUuid) accountInclude.where = { personUuid };

  // query database
  try {
    const log = await Log.findAll({ where: condition, include: [accountInclude] });
    return log.map(unpackLog);
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(id) {
  // query database
  const accountInclude = {
    model: Account,
    attributes: ['pluginUuid'],
  };

  let log;
  try {
    log = await Log.findByPk(id, { include: [accountInclude] });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (log === null) {
    throw new httpErrors[404](`Log entry with ID=${id} not found`);
  }

  return unpackLog(log);
}

export async function readByNativeLocation({ pluginUuid, nativeId, nativeLocation }) {
  // validate data
  if (!pluginUuid) {
    throw new httpErrors[400]('`pluginUuid` can not be empty!');
  }

  if (!nativeId) {
    throw new httpErrors[400]('`nativeId` can not be empty!');
  }

  if (!nativeLocation) {
    throw new httpErrors[400]('`nativeLocation` can not be empty!');
  }

  // query database

  const accountInclude = {
    model: Account,
    attributes: ['pluginUuid'],
    where: { pluginUuid, nativeId },
  };

  let log;
  try {
    log = await Log.findOne({ where: { nativeLocation }, include: [accountInclude] });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (log === null) {
    throw new httpErrors[404](
      `Log entry with plugin UUID=${pluginUuid}, nativeId=<REDACTED>, nativeLocation=<REDACTED> not found`,
    );
  }

  return unpackLog(log);
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
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](`Log entry with ID=${id} not found`);
  }

  return { message: 'Log entry was updated successfully.' };
}

export async function del(id) {
  // save to database
  let num;
  try {
    num = await Log.destroy({
      where: { id },
    });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](`Log entry with ID=${id} not found`);
  }

  return { message: 'Log entry was deleted successfully.' };
}

export async function delMany({ entries }) {
  // validate data
  if (!Array.isArray(entries)) {
    throw new httpErrors[400]('`entries` must be a list of log entry IDs!');
  }

  // save to database
  let num;
  try {
    const condition = {
      id: { [Op.in]: entries },
    };

    num = await Log.destroy({ where: condition });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== entries.length) {
    throw new httpErrors[404](
      `Only ${num} of ${entries.length} log entries have been found and deleted`,
    );
  }

  return { message: 'Log entries were deleted successfully.' };
}
