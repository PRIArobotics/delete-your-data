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
  // await Plugin.del(plugin_uuid);
});

describe('Account Controller', () => {
  test('it works', async () => {
    let uuid1, person_uuid2;

    // create
    {
      const account = await Account.create({
        plugin_uuid,
        native_id: 'account',
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        uuid: expect.any(String),
        person_uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        plugin_uuid,
        native_id: 'account',
      });

      uuid1 = account.uuid;
    }
    {
      const account = await Account.create({
        plugin_uuid,
        native_id: { username: 'other_account' },
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        uuid: expect.any(String),
        person_uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        plugin_uuid,
        native_id: { username: 'other_account' },
      });

      person_uuid2 = account.person_uuid;
    }

    // read all
    {
      const accounts = await Account.readAll();
      // toMatchObject because sequelize model instances are not plain objects
      expect(accounts.filter((account) => account.plugin_uuid === plugin_uuid)).toMatchObject([
        {
          uuid: expect.any(String),
          person_uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          plugin_uuid,
          native_id: 'account',
        },
        {
          uuid: expect.any(String),
          person_uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          plugin_uuid,
          native_id: { username: 'other_account' },
        },
      ]);
    }

    // read all accounts for one account UUID
    {
      const accounts = await Account.readAllByUuid(person_uuid2);
      // toMatchObject because sequelize model instances are not plain objects
      expect(accounts).toMatchObject([
        {
          uuid: expect.any(String),
          person_uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          plugin_uuid,
          native_id: { username: 'other_account' },
        },
      ]);
    }

    // update
    {
      await Account.update(uuid1, {
        plugin_uuid,
        native_id: 'account2',
      });
    }

    // read update
    {
      const account = await Account.read(uuid1);
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        uuid: expect.any(String),
        person_uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        plugin_uuid,
        native_id: 'account2',
      });
    }

    // update by UUID
    {
      await Account.updateByUuid(person_uuid2, plugin_uuid, {
        plugin_uuid,
        native_id: { username: 'other_account2' },
      });
    }

    // read update by UUID
    {
      const account = await Account.readByUuid(person_uuid2, plugin_uuid);
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        uuid: expect.any(String),
        person_uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        plugin_uuid,
        native_id: { username: 'other_account2' },
      });
    }

    // delete
    {
      await Account.del(uuid1);
      await Account.delByUuid(person_uuid2, plugin_uuid);

      const accounts = await Account.readAll();
      // manually filter for only those using the test plugin
      expect(accounts.filter((account) => account.plugin_uuid === plugin_uuid)).toHaveLength(0);
    }
  });
});
