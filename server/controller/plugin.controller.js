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
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll({ search, name, type }) {
  // create filter
  const condition = {};
  if (name) condition.name = { [Op.like]: `%${name}%` };
  if (type) condition.type = { [Op.like]: `%${type}%` };

  if (search) {
    condition[Op.or] = {
      name: { [Op.like]: `%${search}%` },
      type: { [Op.like]: `%${search}%` },
    };
  }

  // query database
  try {
    const plugins = await Plugin.findAll({ where: condition });
    return plugins;
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(uuid) {
  // query database
  let plugin;
  try {
    plugin = await Plugin.findByPk(uuid);
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (plugin === null) {
    throw new httpErrors[404](`Plugin with UUID=${uuid} not found`);
  }

  return plugin;
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
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](`Plugin with UUID=${uuid} not found`);
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
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](`Plugin with UUID=${uuid} not found`);
  }

  return { message: 'Plugin was deleted successfully.' };
}

export async function delMany({ plugins }) {
  // validate data
  if (!Array.isArray(plugins)) {
    throw new httpErrors[400]('`plugins` must be a list of plugin UUIDs!');
  }

  // save to database
  let num;
  try {
    const condition = {
      uuid: { [Op.in]: plugins },
    };

    num = await Plugin.destroy({ where: condition });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== plugins.length) {
    throw new httpErrors[404](
      `Only ${num} of ${plugins.length} plugins have been found and deleted`,
    );
  }

  return { message: 'Plugins were deleted successfully.' };
}
