import httpErrors from 'httperrors';

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
    let id, timestamp;

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
      timestamp = +log.createdAt;
    }

    // create errors
    await expect(
      Log.create({
        nativeLocation: 'foo',
      }),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Log.create({
        accountUuid,
      }),
    ).rejects.toThrow(httpErrors[400]);

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
    {
      const logs = await Log.readAll({ earliest: new Date(timestamp) });
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
    {
      const logs = await Log.readAll({ latest: new Date(timestamp) });
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

    // update errors
    await expect(
      Log.update(id, {
        nativeLocation: 'foo',
      }),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Log.update(id, {
        accountUuid,
      }),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Log.update(1234567, {
        accountUuid,
        nativeLocation: 'bar',
      }),
    ).rejects.toThrow(httpErrors[404]);

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

    // read errors

    await expect(Log.read(1234567)).rejects.toThrow(httpErrors[404]);

    // delete
    {
      await Log.del(id);

      expect(await Log.readAll({ accountUuid })).toHaveLength(0);
    }

    // delete errors

    await expect(Log.del(1234567)).rejects.toThrow(httpErrors[404]);
  });
});
