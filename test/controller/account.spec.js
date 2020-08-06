import httpErrors from 'httperrors';

import { initSequelize } from '~/models';
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
    let uuid, personUuid;

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

    // delete
    {
      await Account.del(uuid);

      const accounts = await Account.readAll({ pluginUuid });
      expect(accounts).toHaveLength(0);
    }

    // delete errors

    await expect(Account.del('1d47affb-74b9-42cc-920b-c97908064a79')).rejects.toThrow(
      httpErrors[404],
    );
  });
});
