import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Account, Entry } from '../models';

export async function create({ dydAxios, dydPluginUuid }, { username, content }) {
  // validate data
  if (!username) {
    throw new httpErrors[400]('`username` can not be empty!');
  }

  if (!content) {
    throw new httpErrors[400]('`content` can not be empty!');
  }

  // save to database
  let entry;
  try {
    entry = await Entry.create({ username, content });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  // index in DYD
  try {
    const nativeId = JSON.stringify(username);
    const { data: account } = await dydAxios.get(`/plugin/${dydPluginUuid}/account/${nativeId}`);

    await dydAxios.post('log', {
      accountUuid: account.uuid,
      nativeLocation: entry.id,
    });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred indexing the account...');
  }

  return entry;
}

export async function readAll({ username }) {
  // create filter
  const condition = {};
  if (username) condition.username = username;

  // query database
  try {
    const entry = await Entry.findAll({ where: condition });
    return entry;
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(id) {
  // query database
  let entry;
  try {
    entry = await Entry.findByPk(id);
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (entry === null) {
    throw new httpErrors[404](`Entry with ID=${id} not found`);
  }

  return entry;
}

export async function update(id, { username, content }) {
  // validate data
  if (!username) {
    throw new httpErrors[400]('`username` can not be empty!');
  }

  if (!content) {
    throw new httpErrors[400]('`content` can not be empty!');
  }

  // save to database
  let num;
  try {
    // update returns one or two numbers (usually one, except for special circumstances:
    // https://sequelize.org/v5/class/lib/model.js~Model.html#static-method-update)
    // we want the first of those numbers, i.e. do an array destructuring assignment here:
    [num] = await Entry.update(
      { username, content },
      {
        where: { id },
      },
    );
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](`Entry with ID=${id} not found`);
  }

  return { message: 'Entry was updated successfully.' };
}

export async function del(id) {
  // save to database
  let num;
  try {
    num = await Entry.destroy({
      where: { id },
    });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](`Entry with ID=${id} not found`);
  }

  return { message: 'Entry was deleted successfully.' };
}
