import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Access } from '../models';

export async function create({ pluginUuid, tokenUuid }) {
  // validate data
  if (!pluginUuid) {
    throw new httpErrors[400]('`pluginUuid` can not be empty!');
  }

  if (!tokenUuid) {
    throw new httpErrors[400]('`tokenUuid` can not be empty!');
  }

  // save to database
  try {
    const access = await Access.create({ pluginUuid, tokenUuid });
    return access;
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll({ pluginUuid, tokenUuid }) {
  // create filter
  const condition = {};
  if (pluginUuid) condition.pluginUuid = pluginUuid;
  if (tokenUuid) condition.tokenUuid = tokenUuid;

  // query database
  try {
    const access = await Access.findAll({ where: condition });
    return access;
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(pluginUuid) {
  // query database
  let access;
  try {
    access = await Access.findByPk(pluginUuid);
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (account === null) {
    throw new httpErrors[404](`Account with UUID=${uuid} not found`);
  }

  return account;
}

export async function del(uuid) {
  // save to database
  let num;
  try {
    num = await Account.destroy({ where: { uuid } });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](`Account with UUID=${uuid} not found`);
  }

  return { message: 'Account was deleted successfully.' };
}

export async function delMany({ accounts }) {
  // validate data
  if (!Array.isArray(accounts)) {
    throw new httpErrors[400]('`accounts` must be a list of accout UUIDs!');
  }

  // save to database
  let num;
  try {
    const condition = {
      uuid: { [Op.in]: accounts },
    };

    num = await Account.destroy({ where: condition });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== accounts.length) {
    throw new httpErrors[404](
      `Only ${num} of ${accounts.length} accounts have been found and deleted`,
    );
  }

  return { message: 'Accounts were deleted successfully.' };
}
