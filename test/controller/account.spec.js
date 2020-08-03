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
    let uuid;

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
    }

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

    // update
    {
      await Account.update(uuid, {
        pluginUuid,
        nativeId: { username: 'account2' },
      });
    }

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

    // delete
    {
      await Account.del(uuid);

      const accounts = await Account.readAll({ pluginUuid });
      expect(accounts).toHaveLength(0);
    }
  });
});
