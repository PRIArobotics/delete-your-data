import { initSequelize } from '~/models';
import { Plugin, User } from '~/server/controller';

let plugin_uuid;

beforeAll(async () => {
  await initSequelize();

  const plugin = await Plugin.create({
    name: 'user_test_plugin',
    type: 'user_test_plugin',
    config: { foo: 0 },
  });

  plugin_uuid = plugin.uuid;
});

afterAll(async () => {
  await Plugin.del(plugin_uuid);
});

describe('User Controller', () => {
  test('it works', async () => {
    let id1, uuid2;

    // create
    {
      const user = await User.create({
        plugin_uuid,
        native_id: 'user',
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(user).toMatchObject({
        uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        plugin_uuid,
        native_id: 'user',
      });

      id1 = user.id;
    }
    {
      const user = await User.create({
        plugin_uuid,
        native_id: 'other_user',
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(user).toMatchObject({
        uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        plugin_uuid,
        native_id: 'other_user',
      });

      uuid2 = user.uuid;
    }

    // read all
    {
      const users = await User.readAll();
      // toMatchObject because sequelize model instances are not plain objects
      expect(users).toMatchObject([
        {
          uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          plugin_uuid,
          native_id: 'user',
        },
        {
          uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          plugin_uuid,
          native_id: 'other_user',
        },
      ]);
    }

    // update
    {
      await User.update(id1, {
        plugin_uuid,
        native_id: 'user2',
      });
    }

    // read update
    {
      const user = await User.read(id1);
      // toMatchObject because sequelize model instances are not plain objects
      expect(user).toMatchObject({
        uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        plugin_uuid,
        native_id: 'user2',
      });
    }

    // update by UUID
    {
      await User.updateByUuid(uuid2, plugin_uuid, {
        plugin_uuid,
        native_id: 'other_user2',
      });
    }

    // read update by UUID
    {
      const user = await User.readByUuid(uuid2, plugin_uuid);
      // toMatchObject because sequelize model instances are not plain objects
      expect(user).toMatchObject({
        uuid: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        plugin_uuid,
        native_id: 'other_user2',
      });
    }

    // delete
    {
      await User.del(id1);
      await User.delByUuid(uuid2, plugin_uuid);

      expect(await User.readAll()).toHaveLength(0);
    }
  });
});
