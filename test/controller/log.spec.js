import { initSequelize } from '~/models';
import { Plugin, Account, Log } from '~/server/controller';

let plugin_uuid, account_id, person_uuid;

beforeAll(async () => {
  await initSequelize();

  const plugin = await Plugin.create({
    name: 'log_test_plugin',
    type: 'log_test_plugin',
    config: { foo: 0 },
  });

  plugin_uuid = plugin.uuid;

  const account = await Account.create({
    plugin_uuid,
    native_id: 'log_test_account',
  });

  account_id = account.id;
  person_uuid = account.person_uuid;
});

afterAll(async () => {
  await Account.del(account_id);
  await Plugin.del(plugin_uuid);
});

describe('Log Controller', () => {
  test('it works', async () => {
    let id;

    // create
    {
      const log = await Log.create({
        account_id,
        native_location: 'foo',
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(log).toMatchObject({
        id: expect.any(Number),
        account_id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        native_location: 'foo',
      });

      id = log.id;
    }

    // read all
    {
      const logs = await Log.readAll();
      // toMatchObject because sequelize model instances are not plain objects
      expect(logs).toMatchObject([
        {
          id: expect.any(Number),
          account_id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          native_location: 'foo',
        },
      ]);
    }

    // read all logs for one account ID
    {
      const logs = await Log.readAllByAccountId(account_id);
      // toMatchObject because sequelize model instances are not plain objects
      expect(logs).toMatchObject([
        {
          id: expect.any(Number),
          account_id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          native_location: 'foo',
        },
      ]);
    }

    // update
    {
      await Log.update(id, {
        account_id,
        native_location: 'bar',
      });
    }

    // read update
    {
      const log = await Log.read(id);
      // toMatchObject because sequelize model instances are not plain objects
      expect(log).toMatchObject({
        id: expect.any(Number),
        account_id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        native_location: 'bar',
      });
    }

    // delete
    {
      await Log.del(id);

      expect(await Log.readAll()).toHaveLength(0);
    }
  });
});
