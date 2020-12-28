import crypto from 'crypto';
import bcrypt from 'bcrypt';

import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Admin } from '../models';

function unpackAdmin(admin) {
    let { uuid, username } = admin;

    return { uuid, username };
  }

export async function create({ username }) {
  // validate data
  if (!username) {
    throw new httpErrors[400]('`Username` can not be empty!');
  }

  // save to database
  try {
    // create the password
    // TODO let user set the password
    const password = crypto.randomBytes(20).toString('hex');
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ username, passwordHash });
    return { ...unpackAdmin(admin), password };
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll({ username }) {
  // create filter
  const condition = {};
  if (username) condition.username = { [Op.like]: `%${username}%` };

  // query database
  try {
    const admins = await Admin.findAll({ where: condition });
    return admins.map(unpackAdmin);
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(uuid) {
  // query database
  let admin;
  try {
    admin = await Admin.findByPk(uuid);
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (admin === null) {
    throw new httpErrors[404](`Admin with UUID=${uuid} not found`);
  }

  return unpackAdmin(admin);
}

export async function del(uuid) {
  // save to database
  let num;
  try {
    num = await Admin.destroy({
      where: { uuid },
    });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](`Admin with UUID=${uuid} not found`);
  }

  return { message: 'Admin was deleted successfully.' };
}

export async function delMany({ admins }) {
  // validate data
  if (!Array.isArray(admins)) {
    throw new httpErrors[400]('`admins` must be a list of admin UUIDs!');
  }

  // save to database
  let num;
  try {
    const condition = {
      uuid: { [Op.in]: admins },
    };

    num = await Admins.destroy({ where: condition });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== admins.length) {
    throw new httpErrors[404](`Only ${num} of ${admins.length} admins have been found and deleted`);
  }

  return { message: 'Admins were deleted successfully.' };
}
