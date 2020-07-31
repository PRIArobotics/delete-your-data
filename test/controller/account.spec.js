import { initSequelize } from '~/models';
import { Plugin, Account } from '~/server/controller';

let plugin_uuid;

beforeAll(async () => {
  await initSequelize();

  const plugin = await Plugin.create({
    name: 'account_test_plugin',
    type: 'account_test_plugin',
    config: { foo: 0 },
  });

  plugin_uuid = plugin.uuid;
});

afterAll(async () => {
  await Plugin.del(plugin_uuid);
});

describe('Account Controller', () => {
  test('it works', async () => {
    let id1, uuid2;

    // create
    {
      const account = await Account.create({
        plugin_uuid,
        native_id: 'account',
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        id: expect.any(Number),
        uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        plugin_uuid,
        native_id: 'account',
      });

      id1 = account.id;
    }
    {
      const account = await Account.create({
        plugin_uuid,
        native_id: { username: 'other_account' },
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        id: expect.any(Number),
        uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        plugin_uuid,
        native_id: { username: 'other_account' },
      });

      uuid2 = account.uuid;
    }

    // read all
    {
      const accounts = await Account.readAll();
      // toMatchObject because sequelize model instances are not plain objects
      expect(accounts.filter((account) => account.plugin_uuid === plugin_uuid)).toMatchObject([
        {
          id: expect.any(Number),
          uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          plugin_uuid,
          native_id: 'account',
        },
        {
          id: expect.any(Number),
          uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          plugin_uuid,
          native_id: { username: 'other_account' },
        },
      ]);
    }

    // read all accounts for one account UUID
    {
      const accounts = await Account.readAllByUuid(uuid2);
      // toMatchObject because sequelize model instances are not plain objects
      expect(accounts).toMatchObject([
        {
          id: expect.any(Number),
          uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          plugin_uuid,
          native_id: { username: 'other_account' },
        },
      ]);
    }

    // update
    {
      await Account.update(id1, {
        plugin_uuid,
        native_id: 'account2',
      });
    }

    // read update
    {
      const account = await Account.read(id1);
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        id: expect.any(Number),
        uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        plugin_uuid,
        native_id: 'account2',
      });
    }

    // update by UUID
    {
      await Account.updateByUuid(uuid2, plugin_uuid, {
        plugin_uuid,
        native_id: { username: 'other_account2' },
      });
    }

    // read update by UUID
    {
      const account = await Account.readByUuid(uuid2, plugin_uuid);
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        id: expect.any(Number),
        uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        plugin_uuid,
        native_id: { username: 'other_account2' },
      });
    }

    // delete
    {
      await Account.del(id1);
      await Account.delByUuid(uuid2, plugin_uuid);

      const accounts = await Account.readAll();
      // manually filter for only those using the test plugin
      expect(accounts.filter((account) => account.plugin_uuid === plugin_uuid)).toHaveLength(0);
    }
  });
});
