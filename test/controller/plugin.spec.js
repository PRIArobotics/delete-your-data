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
        name: 'dummy',
        type: 'dummy',
        config: { foo: 0 },
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(plugin).toMatchObject({
        uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        name: 'dummy',
        type: 'dummy',
        config: { foo: 0 },
      });

      uuid = plugin.uuid;
    }

    // read all
    {
      const plugins = await Plugin.readAll({});
      // toMatchObject because sequelize model instances are not plain objects
      expect(plugins).toMatchObject([{
        uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        name: 'dummy',
        type: 'dummy',
        config: { foo: 0 },
      }]);
    }

    // update
    {
      await Plugin.update(uuid, {
        name: 'dummy',
        type: 'dummy',
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
        name: 'dummy',
        type: 'dummy',
        config: { bar: 0 },
      });
    }

    // delete
    {
      await Plugin.del(uuid);

      expect(await Plugin.readAll({})).toHaveLength(0);
    }
  });
});
