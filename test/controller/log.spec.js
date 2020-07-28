import { initSequelize } from '~/models';
import { Plugin, User, Log } from '~/server/controller';

let plugin_uuid, user_id, user_uuid;

beforeAll(async () => {
  await initSequelize();

  const plugin = await Plugin.create({
    name: 'log_test_plugin',
    type: 'log_test_plugin',
    config: { foo: 0 },
  });

  plugin_uuid = plugin.uuid;

  const user = await User.create({
    plugin_uuid,
    native_id: 'log_test_user',
  });

  user_id = user.id;
  user_uuid = user.uuid;
});

afterAll(async () => {
  await User.del(user_id);
  await Plugin.del(plugin_uuid);
});

describe('Log Controller', () => {
  test('it works', async () => {
    let id;

    // create
    {
      const log = await Log.create({
        user_id,
        savelocation: 'foo',
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(log).toMatchObject({
        id: expect.any(Number),
        user_id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        savelocation: 'foo',
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
          user_id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          savelocation: 'foo',
        },
      ]);
    }

    // read all logs for one user ID
    {
      const logs = await Log.readAllByUserId(user_id);
      // toMatchObject because sequelize model instances are not plain objects
      expect(logs).toMatchObject([
        {
          id: expect.any(Number),
          user_id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          savelocation: 'foo',
        },
      ]);
    }

    // update
    {
      await Log.update(id, {
        user_id,
        savelocation: 'bar',
      });
    }

    // read update
    {
      const log = await Log.read(id);
      // toMatchObject because sequelize model instances are not plain objects
      expect(log).toMatchObject({
        id: expect.any(Number),
        user_id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        savelocation: 'bar',
      });
    }

    // delete
    {
      await Log.del(id);

      expect(await Log.readAll()).toHaveLength(0);
    }
  });
});
