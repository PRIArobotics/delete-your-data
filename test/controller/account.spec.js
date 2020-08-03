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
    let uuid1, personUuid2;

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

      uuid1 = account.uuid;
    }
    {
      const account = await Account.create({
        pluginUuid,
        nativeId: { username: 'other_account' },
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        uuid: expect.any(String),
        personUuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        pluginUuid,
        nativeId: { username: 'other_account' },
      });

      personUuid2 = account.personUuid;
    }

    // read all
    {
      const accounts = await Account.readAll();
      // toMatchObject because sequelize model instances are not plain objects
      expect(accounts.filter((account) => account.pluginUuid === pluginUuid)).toMatchObject([
        {
          uuid: expect.any(String),
          personUuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          pluginUuid,
          nativeId: 'account',
        },
        {
          uuid: expect.any(String),
          personUuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          pluginUuid,
          nativeId: { username: 'other_account' },
        },
      ]);
    }

    // read all accounts for one account UUID
    {
      const accounts = await Account.readAllByUuid(personUuid2);
      // toMatchObject because sequelize model instances are not plain objects
      expect(accounts).toMatchObject([
        {
          uuid: expect.any(String),
          personUuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          pluginUuid,
          nativeId: { username: 'other_account' },
        },
      ]);
    }

    // update
    {
      await Account.update(uuid1, {
        pluginUuid,
        nativeId: 'account2',
      });
    }

    // read update
    {
      const account = await Account.read(uuid1);
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        uuid: expect.any(String),
        personUuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        pluginUuid,
        nativeId: 'account2',
      });
    }

    // update by UUID
    {
      await Account.updateByUuid(personUuid2, pluginUuid, {
        pluginUuid,
        nativeId: { username: 'other_account2' },
      });
    }

    // read update by UUID
    {
      const account = await Account.readByUuid(personUuid2, pluginUuid);
      // toMatchObject because sequelize model instances are not plain objects
      expect(account).toMatchObject({
        uuid: expect.any(String),
        personUuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        pluginUuid,
        nativeId: { username: 'other_account2' },
      });
    }

    // delete
    {
      await Account.del(uuid1);
      await Account.delByUuid(personUuid2, pluginUuid);

      const accounts = await Account.readAll();
      // manually filter for only those using the test plugin
      expect(accounts.filter((account) => account.pluginUuid === pluginUuid)).toHaveLength(0);
    }
  });
});
