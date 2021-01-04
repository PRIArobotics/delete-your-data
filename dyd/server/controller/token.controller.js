import crypto from 'crypto';
import bcrypt from 'bcrypt';

import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Token } from '../models';

function unpackToken(token) {
  let {
    uuid,
    createdAt,
    updatedAt,
    description,
  } = token;

  return {
    uuid,
    createdAt,
    updatedAt,
    description,
  };
}

export async function create({ description }) {
  // validate data
  if (!description) {
    throw new httpErrors[400]('`description` can not be empty!');
  }

  // save to database
  try {
    // create the secret
    const secret = crypto.randomBytes(20).toString('hex');
    const secretHash = await bcrypt.hash(secret, 10);

    const token = await Token.create({ description, secretHash });
    return { ...unpackToken(token), secret };
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll({ description }) {
  // create filter
  const condition = {};
  if (description) condition.description = { [Op.like]: `%${description}%` };

  // query database
  try {
    const tokens = await Token.findAll({ where: condition });
    return tokens.map(unpackToken);
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(uuid) {
  // query database
  let token;
  try {
    token = await Token.findByPk(uuid);
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (token === null) {
    throw new httpErrors[404](`Token with UUID=${uuid} not found`);
  }

  return unpackToken(token);
}

export async function check(uuid, secret) {
  // query database
  try {
    const token = await Token.findByPk(uuid);
    if (token === null) return false;

    const matches = await bcrypt.compare(secret, token.secretHash);
    return matches;
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function del(uuid) {
  // save to database
  let num;
  try {
    num = await Token.destroy({
      where: { uuid },
    });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](`Token with UUID=${uuid} not found`);
  }

  return { message: 'Token was deleted successfully.' };
}

export async function delMany({ tokens }) {
  // validate data
  if (!Array.isArray(tokens)) {
    throw new httpErrors[400]('`tokens` must be a list of token UUIDs!');
  }

  // save to database
  let num;
  try {
    const condition = {
      uuid: { [Op.in]: tokens },
    };

    num = await Token.destroy({ where: condition });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== tokens.length) {
    throw new httpErrors[404](`Only ${num} of ${tokens.length} tokens have been found and deleted`);
  }

  return { message: 'Tokens were deleted successfully.' };
}
