import httpErrors from 'httperrors';
import { Op } from 'sequelize';

import { Plugin, Account } from '../models';

export async function create({ pluginUuid, personUuid, nativeId }) {
  // validate data
  if (!pluginUuid) {
    throw new httpErrors[400]('`pluginUuid` can not be empty!');
  }

  if (!nativeId) {
    throw new httpErrors[400]('`nativeId` can not be empty!');
  }

  // save to database
  try {
    const account = await Account.create({ pluginUuid, personUuid, nativeId });
    return account;
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }
}

export async function readMany({ accounts: allAccountUuids }) {
  // validate data
  if (!Array.isArray(allAccountUuids)) {
    throw new httpErrors[400]('`accounts` must be a list of accout UUIDs!');
  }

  // query database
  let accounts;
  try {
    const condition = {
      uuid: { [Op.in]: allAccountUuids },
    };
    const include = [{ model: Plugin }];

    accounts = await Account.findAll({ where: condition, include });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (accounts.length !== allAccountUuids.length) {
    const actualAccountUuids = new Set(accounts.map((account) => account.uuid));
    const notFound = allAccountUuids.filter((uuid) => !actualAccountUuids.has(uuid));
    throw new httpErrors[404](
      `Accounts not found with UUIDs:\n${notFound.map((uuid) => `  ${uuid}`).join('\n')}`,
    );
  }

  return accounts;
}

export async function readManyPersons({ persons: allPersonUuids }) {
  // validate data
  if (!Array.isArray(allPersonUuids)) {
    throw new httpErrors[400]('`persons` must be a list of person UUIDs!');
  }

  // query database
  let accounts;
  try {
    const condition = {
      personUuid: { [Op.in]: allPersonUuids },
    };
    const include = [{ model: Plugin }];

    accounts = await Account.findAll({ where: condition, include });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  const actualPersonUuids = new Set(accounts.map((account) => account.personUuid));
  const notFound = allPersonUuids.filter((uuid) => !actualPersonUuids.has(uuid));
  if (notFound.length !== 0) {
    throw new httpErrors[404](
      `Accounts not found with person UUIDs:\n${notFound.map((uuid) => `  ${uuid}`).join('\n')}`,
    );
  }

  return accounts;
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

export async function readByNativeId({ pluginUuid, nativeId }) {
  // validate data
  if (!pluginUuid) {
    throw new httpErrors[400]('`pluginUuid` can not be empty!');
  }

  if (!nativeId) {
    throw new httpErrors[400]('`nativeId` can not be empty!');
  }

  // query database
  let account;
  try {
    account = await Account.findOne({ where: { pluginUuid, nativeId } });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (account === null) {
    throw new httpErrors[404](
      `Account with plugin UUID=${pluginUuid}, nativeId=<REDACTED> not found`,
    );
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
    [num] = await Account.update({ pluginUuid, nativeId }, { where: { uuid } });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](`Account with UUID=${uuid} not found`);
  }

  return { message: 'Account was updated successfully.' };
}

export async function updateByNativeId({ pluginUuid, nativeId }, { nativeId: newNativeId }) {
  // validate data
  if (!pluginUuid) {
    throw new httpErrors[400]('old `pluginUuid` can not be empty!');
  }

  if (!nativeId) {
    throw new httpErrors[400]('old `nativeId` can not be empty!');
  }

  if (!newNativeId) {
    throw new httpErrors[400]('new `nativeId` can not be empty!');
  }

  // save to database
  let num;
  try {
    // update returns one or two numbers (usually one, except for special circumstances:
    // https://sequelize.org/v5/class/lib/model.js~Model.html#static-method-update)
    // we want the first of those numbers, i.e. do an array destructuring assignment here:
    [num] = await Account.update({ nativeId: newNativeId }, { where: { pluginUuid, nativeId } });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](
      `Account with plugin UUID=${pluginUuid}, nativeId=<REDACTED> not found`,
    );
  }

  return { message: 'Account was updated successfully.' };
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

export async function delByNativeId({ pluginUuid, nativeId }) {
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
    num = await Account.destroy({ where: { pluginUuid, nativeId } });
  } catch (err) /* istanbul ignore next */ {
    throw new httpErrors[500](err.message || 'An error occurred...');
  }

  if (num !== 1) {
    throw new httpErrors[404](
      `Account with plugin UUID=${pluginUuid}, nativeId=<REDACTED> not found`,
    );
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

async function doRedact(pluginRegistry, mode, accountsGetter) {
  // validate data
  if (!['DELETE', 'ANONYMIZE'].includes(mode)) {
    throw new httpErrors[400]('`mode` must be either DELETE or ANONYMIZE!');
  }

  const accounts = await accountsGetter();

  // for the redaction operations, we need to group all accounts by their plugin
  const pluginMap = new Map();
  for (const account of accounts) {
    const plugin = account.plugin;

    let accountUuids;
    let accountNativeIds;
    if (!pluginMap.has(plugin.uuid)) {
      const pluginInstance = new pluginRegistry[plugin.type](plugin.config);
      accountUuids = [];
      accountNativeIds = [];
      pluginMap.set(plugin.uuid, { pluginInstance, accountUuids, accountNativeIds });
    } else {
      ({ accountUuids, accountNativeIds } = pluginMap.get(account.plugin.uuid));
    }
    accountUuids.push(account.uuid);
    accountNativeIds.push(account.nativeId);
  }

  const plugins = Array.from(pluginMap.values());
  // let all plugins run their redaction operations in parallel
  // TODO error handling. what if one plugin fails early; what happens to others?
  await Promise.all(
    plugins.map(async ({ pluginInstance, accountUuids, accountNativeIds }) => {
      await pluginInstance.redactAccounts(accountNativeIds, mode);
      await delMany({ accounts: accountUuids });
    }),
  );

  return { message: 'Accounts were redacted successfully.' };
}

export async function redact(pluginRegistry, { accounts, mode }) {
  return /* await */ doRedact(pluginRegistry, mode, () => readMany({ accounts }));
}

export async function redactPersons(pluginRegistry, { persons, mode }) {
  return /* await */ doRedact(pluginRegistry, mode, () => readManyPersons({ persons }));
}
