/**
 * @jest-environment node
 */

import httpErrors from 'httperrors';

import { initSequelize } from '~/server/models';
import { Plugin, Account } from '~/server/controller';

let pluginUuid;

beforeAll(async () => {
  await initSequelize();

  const plugin = await Plugin.create({
    name: 'account_test_plugin',
    type: 'account_test_plugin',
    config: { foo: 0 },
  });

  pluginUuid = plugin.uuid;
});

afterAll(async () => {
  await Plugin.del(pluginUuid);
});

describe('Account Controller', () => {
  test('it works', async () => {
    let uuid, uuid2, personUuid;

    // create
    {
      const account = await Account.create({
        pluginUuid,
        nativeId: 'account',
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        uuid: expect.any(String),
        personUuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        pluginUuid,
        nativeId: 'account',
      });

      uuid = account.uuid;
      personUuid = account.personUuid;
    }

    // create errors
    await expect(
      Account.create({
        nativeId: 'account',
      }),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Account.create({
        pluginUuid,
      }),
    ).rejects.toThrow(httpErrors[400]);

    // read many
    {
      const accounts = await Account.readMany({ accounts: [uuid] });
      // toMatchObject because sequelize model instances are not plain objects
      expect(accounts).toMatchObject([
        {
          uuid: expect.any(String),
          personUuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          pluginUuid,
          nativeId: 'account',
        },
      ]);
    }

    // read many errors

    await expect(Account.readMany({})).rejects.toThrow(httpErrors[400]);

    await expect(
      Account.readMany({ accounts: [uuid, '1d47affb-74b9-42cc-920b-c97908064a79'] }),
    ).rejects.toThrow(httpErrors[404]);

    // read many persons
    {
      const accounts = await Account.readManyPersons({ persons: [personUuid] });
      // toMatchObject because sequelize model instances are not plain objects
      expect(accounts).toMatchObject([
        {
          uuid: expect.any(String),
          personUuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          pluginUuid,
          nativeId: 'account',
        },
      ]);
    }

    // read many persons errors

    await expect(Account.readManyPersons({})).rejects.toThrow(httpErrors[400]);

    await expect(
      Account.readManyPersons({ persons: [personUuid, '1d47affb-74b9-42cc-920b-c97908064a79'] }),
    ).rejects.toThrow(httpErrors[404]);

    // read all
    {
      const accounts = await Account.readAll({ pluginUuid });
      // toMatchObject because sequelize model instances are not plain objects
      expect(accounts).toMatchObject([
        {
          uuid: expect.any(String),
          personUuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          pluginUuid,
          nativeId: 'account',
        },
      ]);
    }
    {
      const accounts = await Account.readAll({ personUuid });
      // toMatchObject because sequelize model instances are not plain objects
      expect(accounts).toMatchObject([
        {
          uuid: expect.any(String),
          personUuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          pluginUuid,
          nativeId: 'account',
        },
      ]);
    }

    // update
    {
      await Account.update(uuid, {
        pluginUuid,
        nativeId: { username: 'account2' },
      });
    }

    // update errors
    await expect(
      Account.update(uuid, {
        nativeId: 'account',
      }),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Account.update(uuid, {
        pluginUuid,
      }),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Account.update('1d47affb-74b9-42cc-920b-c97908064a79', {
        pluginUuid,
        nativeId: { username: 'account2' },
      }),
    ).rejects.toThrow(httpErrors[404]);

    // read update
    {
      const account = await Account.read(uuid);
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        uuid: expect.any(String),
        personUuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        pluginUuid,
        nativeId: { username: 'account2' },
      });
    }

    // read errors

    await expect(Account.read('1d47affb-74b9-42cc-920b-c97908064a79')).rejects.toThrow(
      httpErrors[404],
    );

    // create 2nd account
    {
      const account = await Account.create({
        pluginUuid,
        personUuid,
        nativeId: '2nd_account',
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        uuid: expect.any(String),
        personUuid,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        pluginUuid,
        nativeId: '2nd_account',
      });

      uuid2 = account.uuid;
    }

    // read all
    {
      const accounts = await Account.readAll({ personUuid });
      // toMatchObject because sequelize model instances are not plain objects
      expect(accounts.sort((a, b) => a.createdAt - b.createdAt)).toMatchObject([
        {
          uuid: expect.any(String),
          personUuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          pluginUuid,
          nativeId: { username: 'account2' },
        },
        {
          uuid: expect.any(String),
          personUuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          pluginUuid,
          nativeId: '2nd_account',
        },
      ]);
    }

    // delete
    {
      await Account.del(uuid);
      await Account.del(uuid2);

      expect(await Account.readAll({ pluginUuid })).toHaveLength(0);
    }

    // delete errors

    await expect(Account.del('1d47affb-74b9-42cc-920b-c97908064a79')).rejects.toThrow(
      httpErrors[404],
    );

    // create new test account
    {
      const account = await Account.create({
        pluginUuid,
        nativeId: 'other_account',
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        uuid: expect.any(String),
        personUuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        pluginUuid,
        nativeId: 'other_account',
      });

      uuid = account.uuid;
    }

    // delete many
    {
      await Account.delMany({ accounts: [uuid] });

      expect(await Account.readAll({ pluginUuid })).toHaveLength(0);
    }

    // delete many errors

    await expect(Account.delMany({})).rejects.toThrow(httpErrors[400]);

    await expect(
      Account.delMany({ accounts: ['1d47affb-74b9-42cc-920b-c97908064a79'] }),
    ).rejects.toThrow(httpErrors[404]);
  });
});
