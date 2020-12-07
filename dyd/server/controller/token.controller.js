import crypto from 'crypto';

import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Token } from '../models';

export async function create({ description }) {
  // validate data
  if (!description) {
    throw new httpErrors[400]('`description` can not be empty!');
  }

  

  // save to database
  try {
    //create the token String
    const tokenString = crypto.randomBytes(20).toString('hex');
    const hashedToken = await bcrypt.hash(tokenString, 10);

    const token = await Token.create({ hashedToken, description });
    return { description: token.description, token: tokenString };
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
    const token = await Token.findAll({ where: condition });
    return token;
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

  return token;
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
    throw new httpErrors[404](
      `Only ${num} of ${tokens.length} tokens have been found and deleted`,
    );
  }

  return { message: 'Tokens were deleted successfully.' };
}
