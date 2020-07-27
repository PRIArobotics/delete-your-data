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

    // update
    {
      await Plugin.update(uuid, {
        name: 'plugin_test',
        type: 'plugin_test',
        config: { bar: 0 },
      });
    }

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

    // delete
    {
      await Plugin.del(uuid);

      expect(await Plugin.readAll({ name: 'plugin_test' })).toHaveLength(0);
    }
  });
});
