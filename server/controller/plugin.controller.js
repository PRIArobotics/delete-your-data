import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Plugin } from '../../models';

export async function create({ name, type, config }) {
  // validate data
  if (!name) {
    throw new httpErrors[400]('`name` can not be empty!');
  }

  if (!type) {
    throw new httpErrors[400]('`type` can not be empty!');
  }

  // save to database
  try {
    const plugin = await Plugin.create({ name, type, config });
    return plugin;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll({ search, name, type }) {
  // create filter
  let condition = null;
  if (search || name || type) {
    condition = {};
    if (name) condition.name = { [Op.like]: `%${name}%` };
    if (type) condition.type = { [Op.like]: `%${type}%` };

    if (search) {
      condition[Op.or] = {
        name: { [Op.like]: `%${search}%` },
        type: { [Op.like]: `%${search}%` },
      };
    }
  }

  // query database
  try {
    const plugins = await Plugin.findAll({ where: condition });
    return plugins;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(uuid) {
  // query database
  try {
    const plugin = await Plugin.findByPk(uuid);
    return plugin;
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function update(uuid, { name, type, config }) {
  // validate data
  if (!name) {
    throw new httpErrors[400]('`name` can not be empty!');
  }

  if (!type) {
    throw new httpErrors[400]('`type` can not be empty!');
  }

  // save to database
  let num;
  try {
    // update returns one or two numbers (usually one, except for special circumstances:
    // https://sequelize.org/v5/class/lib/model.js~Model.html#static-method-update)
    // we want the first of those numbers, i.e. do an array destructuring assignment here:
    [num] = await Plugin.update(
      { name, type, config },
      {
        where: { uuid },
      },
    );
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Updating Plugin with UUID=${uuid} failed`);
  }

  return { message: 'Plugin was updated successfully.' };
}

export async function del(uuid) {
  // save to database
  let num;
  try {
    num = await Plugin.destroy({
      where: { uuid },
    });
  } catch (err) {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[400](`Deleting Plugin with UUID=${uuid} failed`);
  }

  return { message: 'Plugin was deleted successfully.' };
}
