/**
 * @jest-environment node
 */

import httpErrors from 'httperrors';

import { initSequelize } from '~/server/models';
import { Plugin, Account, Log } from '~/server/controller';

let pluginUuid, accountUuid, personUuid, nativeId;

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
  nativeId = account.nativeId;
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
        pluginUuid,
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
          pluginUuid,
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
          pluginUuid,
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
          pluginUuid,
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
          pluginUuid,
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
        pluginUuid,
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

    // create new test log entry
    {
      const log = await Log.create({
        accountUuid,
        nativeLocation: 'foo',
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(log).toMatchObject({
        id: expect.any(Number),
        pluginUuid,
        accountUuid,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        nativeLocation: 'foo',
      });

      id = log.id;
    }

    // update by native location
    {
      await Log.updateByNativeLocation(
        { pluginUuid, nativeId, nativeLocation: 'foo' },
        { accountUuid, nativeLocation: 'bar' },
      );
    }

    // update by native location errors

    await expect(
      Log.updateByNativeLocation({ pluginUuid, nativeId }, { accountUuid, nativeLocation: 'baz' }),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Log.updateByNativeLocation(
        { pluginUuid, nativeLocation: 'bar' },
        { accountUuid, nativeLocation: 'baz' },
      ),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Log.updateByNativeLocation(
        { nativeId, nativeLocation: 'bar' },
        { accountUuid, nativeLocation: 'baz' },
      ),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Log.updateByNativeLocation({ pluginUuid, nativeId, nativeLocation: 'bar' }, { accountUuid }),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Log.updateByNativeLocation(
        { pluginUuid, nativeId, nativeLocation: 'bar' },
        { nativeLocation: 'baz' },
      ),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Log.updateByNativeLocation(
        { pluginUuid, nativeId, nativeLocation: 'foo' },
        { accountUuid, nativeLocation: 'baz' },
      ),
    ).rejects.toThrow(httpErrors[404]);

    // read by native location
    {
      const log = await Log.readByNativeLocation({ pluginUuid, nativeId, nativeLocation: 'bar' });
      // toMatchObject because sequelize model instances are not plain objects
      expect(log).toMatchObject({
        id: expect.any(Number),
        pluginUuid,
        accountUuid,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        nativeLocation: 'bar',
      });
    }

    // read by native location errors

    await expect(Log.readByNativeLocation({ pluginUuid, nativeId })).rejects.toThrow(
      httpErrors[400],
    );

    await expect(Log.readByNativeLocation({ pluginUuid, nativeLocation: 'bar' })).rejects.toThrow(
      httpErrors[400],
    );

    await expect(Log.readByNativeLocation({ nativeId, nativeLocation: 'bar' })).rejects.toThrow(
      httpErrors[400],
    );

    await expect(
      Log.readByNativeLocation({ pluginUuid, nativeId, nativeLocation: 'foo' }),
    ).rejects.toThrow(httpErrors[404]);

    // delete many
    {
      await Log.delMany({ entries: [id] });

      expect(await Log.readAll({ accountUuid })).toHaveLength(0);
    }

    // delete many errors

    await expect(Log.delMany({})).rejects.toThrow(httpErrors[400]);

    await expect(Log.delMany({ entries: [1234567] })).rejects.toThrow(httpErrors[404]);
  });
});
