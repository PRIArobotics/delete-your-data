import request from 'supertest';

import appPromise from '@/server/app';

describe('REST API', () => {
  test('works', async () => {
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
  });
});
