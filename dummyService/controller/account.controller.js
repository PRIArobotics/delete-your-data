import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Account } from '../models';

export async function create({ username }) {
  // validate data
  if (!username) {
    throw new httpErrors[400]('`username` can not be empty!');
  }

  // save to database
  try {
    const account = await Account.create({ username });
    return account;
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll() {
  // query database
  try {
    const accounts = await Account.findAll();
    return accounts;
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(username) {
  // query database
  let account;
  try {
    account = await Account.findByPk(username);
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (account === null) {
    throw new httpErrors[404](`Account with UUID=${uuid} not found`);
  }

  return account;
}

export async function del(username) {
  // save to database
  let num;
  try {
    num = await Account.destroy({
      where: { username },
    });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](`Account with username=${username} not found`);
  }

  return { message: 'Account was deleted successfully.' };
}
