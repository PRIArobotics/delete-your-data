import request from 'supertest';

import appPromise from '@/server/app';
import { Plugin } from '~/server/controller';

jest.mock('~/server/controller/plugin.controller');

describe('REST API', () => {
  test('Plugin endpoints work', async () => {
    let plugin;

    // create
    {
      Plugin.create.mockImplementationOnce(async ({ name, type, config }) => {
        const createdAt = new Date();
        plugin = {
          uuid: '7224835f-a10b-44d3-94b2-959580a327cf',
          createdAt,
          updatedAt: createdAt,
          name,
          type,
          config,
        };
        return plugin;
      });

      const res = await request(await appPromise)
        .post('/api/plugin')
        .send({
          name: 'dummy',
          type: 'dummy',
          config: { foo: 0 },
        });

      expect(Plugin.create).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        ...plugin,
        createdAt: plugin.createdAt.toISOString(),
        updatedAt: plugin.updatedAt.toISOString(),
      });
    }

    // read all
    {
      Plugin.readAll.mockImplementationOnce(async () => [plugin]);

      const res = await request(await appPromise)
        .get(`/api/plugin`)
        .send();

      expect(Plugin.readAll).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([{
        ...plugin,
        createdAt: plugin.createdAt.toISOString(),
        updatedAt: plugin.updatedAt.toISOString(),
      }]);
    }

    // update
    {
      Plugin.update.mockImplementationOnce(async (uuid, { name, type, config }) => {
        plugin.updatedAt = new Date();
        plugin.name = name;
        plugin.type = type;
        plugin.config = config;
      });

      const res = await request(await appPromise)
        .put(`/api/plugin/${plugin.uuid}`)
        .send({
          name: 'dummy',
          type: 'dummy',
          config: { bar: 0 },
        });

      expect(Plugin.update).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
    }

    // read update
    {
      Plugin.read.mockImplementationOnce(async () => plugin);

      const res = await request(await appPromise)
        .get(`/api/plugin/${plugin.uuid}`)
        .send();

      expect(Plugin.read).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        ...plugin,
        createdAt: plugin.createdAt.toISOString(),
        updatedAt: plugin.updatedAt.toISOString(),
      });
    }

    // delete
    {
      Plugin.del.mockImplementationOnce(async (uuid) => {});

      const res = await request(await appPromise)
        .delete(`/api/plugin/${plugin.uuid}`)
        .send();

      expect(Plugin.del).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
    }
  });
});
