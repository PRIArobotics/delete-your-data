import httpErrors from 'httperrors';
import { Op, ValidationError } from 'sequelize';

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
  } catch (err) {
    // if it's a duplicate key error, handle that
    // istanbul ignore else
    if (err instanceof ValidationError) {
      const messages = err.errors.map((item) => item.message);
      throw new httpErrors[400](`Validation error: ${messages.join(', ')}`);
    } else {
      throw new httpErrors[500](err.message || 'An error occurred...');
    }
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

export async function read(pluginUuid, tokenUuid) {
  // query database
  let access;
  try {
    access = await Access.findOne({ where: { pluginUuid, tokenUuid } });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (access === null) {
    throw new httpErrors[404](
      `Access with pluginUuid=${pluginUuid}, tokenUuid=${tokenUuid} not found`,
    );
  }

  return access;
}

export async function del(pluginUuid, tokenUuid) {
  // save to database
  let num;
  try {
    num = await Access.destroy({ where: { pluginUuid, tokenUuid } });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](
      `Access with pluginUuid=${pluginUuid}, tokenUuid=${tokenUuid} not found`,
    );
  }

  return { message: 'Access was deleted successfully.' };
}
