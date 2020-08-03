import { initSequelize } from '~/models';
import { Plugin, Account, Log } from '~/server/controller';

let pluginUuid, accountUuid, personUuid;

beforeAll(async () => {
  await initSequelize();

  const plugin = await Plugin.create({
    name: 'log_test_plugin',
    type: 'log_test_plugin',
    config: { foo: 0 },
  });

  pluginUuid = plugin.uuid;

  const account = await Account.create({
    pluginUuid,
    nativeId: 'log_test_account',
  });

  accountUuid = account.uuid;
  personUuid = account.personUuid;
});

afterAll(async () => {
  await Account.del(accountUuid);
  await Plugin.del(pluginUuid);
});

describe('Log Controller', () => {
  test('it works', async () => {
    let id;

    // create
    {
      const log = await Log.create({
        accountUuid,
        nativeLocation: 'foo',
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(log).toMatchObject({
        id: expect.any(Number),
        accountUuid,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        nativeLocation: 'foo',
      });

      id = log.id;
    }

    // read all
    {
      const logs = await Log.readAll({ accountUuid });
      // toMatchObject because sequelize model instances are not plain objects
      expect(logs).toMatchObject([
        {
          id: expect.any(Number),
          accountUuid,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          nativeLocation: 'foo',
        },
      ]);
    }

    // read all by person
    {
      const logs = await Log.readAll({ personUuid });
      // toMatchObject because sequelize model instances are not plain objects
      expect(logs).toMatchObject([
        {
          id: expect.any(Number),
          accountUuid,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          nativeLocation: 'foo',
        },
      ]);
    }

    // update
    {
      await Log.update(id, {
        accountUuid,
        nativeLocation: 'bar',
      });
    }

    // read update
    {
      const log = await Log.read(id);
      // toMatchObject because sequelize model instances are not plain objects
      expect(log).toMatchObject({
        id: expect.any(Number),
        accountUuid,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        nativeLocation: 'bar',
      });
    }

    // delete
    {
      await Log.del(id);

      expect(await Log.readAll({ accountUuid })).toHaveLength(0);
    }
  });
});
