import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Plugin, Account } from '../../models';

export async function create({ pluginUuid, nativeId }) {
  // validate data
  if (!pluginUuid) {
    throw new httpErrors[400]('`pluginUuid` can not be empty!');
  }

  if (!nativeId) {
    throw new httpErrors[400]('`nativeId` can not be empty!');
  }

  // save to database
  try {
    const account = await Account.create({ pluginUuid, nativeId });
    return account;
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readAll({ personUuid, pluginUuid }) {
  // create filter
  const condition = {};
  if (personUuid) condition.personUuid = personUuid;
  if (pluginUuid) condition.pluginUuid = pluginUuid;

  // query database
  try {
    const accounts = await Account.findAll({ where: condition });
    return accounts;
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function read(uuid) {
  // query database
  let account;
  try {
    account = await Account.findByPk(uuid);
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (account === null) {
    throw new httpErrors[404](`Account with UUID=${uuid} not found`);
  }

  return account;
}

export async function update(uuid, { pluginUuid, nativeId }) {
  // validate data
  if (!pluginUuid) {
    throw new httpErrors[400]('`pluginUuid` can not be empty!');
  }

  if (!nativeId) {
    throw new httpErrors[400]('`nativeId` can not be empty!');
  }

  // save to database
  let num;
  try {
    // update returns one or two numbers (usually one, except for special circumstances:
    // https://sequelize.org/v5/class/lib/model.js~Model.html#static-method-update)
    // we want the first of those numbers, i.e. do an array destructuring assignment here:
    [num] = await Account.update(
      { pluginUuid, nativeId },
      {
        where: { uuid },
      },
    );
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num === 0) {
    throw new httpErrors[404](`Account with UUID=${uuid} not found`);
  }

  // istanbul ignore if
  if (num > 1) {
    throw new httpErrors[500]('unreachable: multiple accounts with same UUID updated');
  }

  return { message: 'Account was updated successfully.' };
}

export async function del(uuid) {
  // save to database
  let num;
  try {
    num = await Account.destroy({
      where: { uuid },
    });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num === 0) {
    throw new httpErrors[404](`Account with UUID=${uuid} not found`);
  }

  // istanbul ignore if
  if (num > 1) {
    throw new httpErrors[500]('unreachable: multiple accounts with same UUID deleted');
  }

  return { message: 'Account was deleted successfully.' };
}

export async function redact(pluginRegistry, { accounts: accountUuids, mode }) {
  // validate data
  if (!Array.isArray(accountUuids)) {
    throw new httpErrors[400]('`accounts` must be a list of accout UUIDs!');
  }

  if (!['DELETE', 'ANONYMIZE'].includes(mode)) {
    throw new httpErrors[400]('`mode` must be either DELETE or ANONYMIZE!');
  }

  // query database
  let accounts;
  try {
    const condition = {
      uuid: { [Op.in]: accountUuids },
    };
    const include = [{ model: Plugin }];

    accounts = await Account.findAll({ where: condition, include });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (accounts.length !== accountUuids.length) {
    const actualAccountUuids = new Set(accounts.map((account) => account.uuid));
    const notFound = accountUuids.filter((uuid) => !actualAccountUuids.has(uuid));
    throw new httpErrors[404](
      `Accounts not found with UUIDs:\n${notFound.map((uuid) => `  ${uuid}`).join('\n')}`,
    );
  }

  // for the redaction operations, we need to group all accounts by their plugin
  const pluginMap = new Map();
  for (const account of accounts) {
    let accountIds;
    if (!pluginMap.has(account.pluginUuid)) {
      const { type, config } = account.plugin;
      const plugin = new pluginRegistry[type](config);
      accountIds = [];
      pluginMap.set(account.pluginUuid, { plugin, accountIds });
    } else {
      accountIds = pluginMap.get(account.pluginUuid).accountIds;
    }
    accountIds.push(account.nativeId);
  }

  const plugins = Array.from(pluginMap.values());
  // let all plugins run their redaction operations in parallel
  // TODO error handling. what if one plugin fails early; what happens to others?
  await Promise.all(
    plugins.map(({ plugin, accountIds }) => plugin.redactAccounts(accountIds, mode)),
  );

  return { message: 'Accounts were redacted successfully.' };
}
