import request from 'supertest';

import appPromise from '@/server/app';

describe('REST API', () => {
  test('Plugin endpoints work', async () => {
    let plugin;

    // create
    {
      const res = await request(await appPromise)
        .post('/api/plugin')
        .send({
          name: 'dummy',
          type: 'dummy',
          config: { foo: 0 },
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        uuid: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        name: 'dummy',
        type: 'dummy',
        config: { foo: 0 },
      });

      plugin = res.body;
    }

    // read all
    {
      const res = await request(await appPromise)
        .get(`/api/plugin`)
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([plugin]);
    }

    // update
    {
      const res = await request(await appPromise)
        .put(`/api/plugin/${plugin.uuid}`)
        .send({
          name: 'dummy',
          type: 'dummy',
          config: { bar: 0 },
        });
      expect(res.statusCode).toEqual(200);
    }

    // read update
    {
      const res = await request(await appPromise)
        .get(`/api/plugin/${plugin.uuid}`)
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        ...plugin,
        updatedAt: expect.any(String),
        config: { bar: 0 },
      });
    }

    // delete
    {
      const res = await request(await appPromise)
        .delete(`/api/plugin/${plugin.uuid}`)
        .send();
      expect(res.statusCode).toEqual(200);
    }
  });
});
