import httpErrors from 'httperrors';

import { initSequelize } from '~/models';
import { Plugin } from '~/server/controller';

beforeAll(async () => {
  await initSequelize();
});

describe('Plugin Controller', () => {
  test('it works', async () => {
    let uuid;

    // create
    {
      const plugin = await Plugin.create({
        name: 'plugin_test',
        type: 'plugin_test',
        config: { foo: 0 },
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(plugin).toMatchObject({
        uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        name: 'plugin_test',
        type: 'plugin_test',
        config: { foo: 0 },
      });

      uuid = plugin.uuid;
    }

    // create errors
    await expect(
      Plugin.create({
        type: 'plugin_test',
      }),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Plugin.create({
        name: 'plugin_test',
      }),
    ).rejects.toThrow(httpErrors[400]);

    // read all
    {
      const plugins = await Plugin.readAll({ name: 'plugin_test' });
      // toMatchObject because sequelize model instances are not plain objects
      expect(plugins).toMatchObject([
        {
          uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          name: 'plugin_test',
          type: 'plugin_test',
          config: { foo: 0 },
        },
      ]);
    }
    {
      const plugins = await Plugin.readAll({ type: 'plugin_test' });
      // toMatchObject because sequelize model instances are not plain objects
      expect(plugins).toMatchObject([
        {
          uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          name: 'plugin_test',
          type: 'plugin_test',
          config: { foo: 0 },
        },
      ]);
    }
    {
      const plugins = await Plugin.readAll({ search: 'plugin_test' });
      // toMatchObject because sequelize model instances are not plain objects
      expect(plugins).toMatchObject([
        {
          uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          name: 'plugin_test',
          type: 'plugin_test',
          config: { foo: 0 },
        },
      ]);
    }

    // update
    {
      await Plugin.update(uuid, {
        name: 'plugin_test',
        type: 'plugin_test',
        config: { bar: 0 },
      });
    }

    // update errors

    await expect(
      Plugin.update(uuid, {
        type: 'plugin_test',
      }),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Plugin.update(uuid, {
        name: 'plugin_test',
      }),
    ).rejects.toThrow(httpErrors[400]);

    await expect(
      Plugin.update('7224835f-a10b-44d3-94b2-959580a327cf', {
        name: 'plugin_test',
        type: 'plugin_test',
        config: { bar: 0 },
      }),
    ).rejects.toThrow(httpErrors[404]);

    // read update
    {
      const plugin = await Plugin.read(uuid);
      // toMatchObject because sequelize model instances are not plain objects
      expect(plugin).toMatchObject({
        uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        name: 'plugin_test',
        type: 'plugin_test',
        config: { bar: 0 },
      });
    }

    // read errors

    await expect(Plugin.read('7224835f-a10b-44d3-94b2-959580a327cf')).rejects.toThrow(
      httpErrors[404],
    );

    // delete
    {
      await Plugin.del(uuid);

      expect(await Plugin.readAll({ name: 'plugin_test' })).toHaveLength(0);
    }

    // delete errors

    await expect(Plugin.del('7224835f-a10b-44d3-94b2-959580a327cf')).rejects.toThrow(
      httpErrors[404],
    );
  });
});
