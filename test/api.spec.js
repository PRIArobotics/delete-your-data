import request from 'supertest';

import appPromise from '@/server/app';
import { Plugin, User } from '~/server/controller';

jest.mock('~/server/controller/plugin.controller');
jest.mock('~/server/controller/user.controller');

describe('REST API', () => {
  test('POST /api/plugin', async () => {
    let plugin;

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

    const body = {
      name: 'dummy',
      type: 'dummy',
      config: { foo: 0 },
    };
    const res = await request(await appPromise)
      .post('/api/plugin')
      .send(body);

    expect(Plugin.create).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...plugin,
      createdAt: plugin.createdAt.toISOString(),
      updatedAt: plugin.updatedAt.toISOString(),
    });
  });

  test('GET /api/plugin', async () => {
    const createdAt = new Date();
    const plugin = {
      uuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
      name: 'dummy',
      type: 'dummy',
      config: { foo: 0 },
    };

    Plugin.readAll.mockImplementationOnce(async () => [plugin]);

    const res = await request(await appPromise)
      .get(`/api/plugin`)
      .send();

    expect(Plugin.readAll).toHaveBeenCalledWith({});
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...plugin,
        createdAt: plugin.createdAt.toISOString(),
        updatedAt: plugin.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/plugin/:uuid', async () => {
    const createdAt = new Date();
    const plugin = {
      uuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
      name: 'dummy',
      type: 'dummy',
      config: { foo: 0 },
    };

    Plugin.read.mockImplementationOnce(async () => plugin);

    const res = await request(await appPromise)
      .get(`/api/plugin/${plugin.uuid}`)
      .send();

    expect(Plugin.read).toHaveBeenCalledWith(plugin.uuid);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...plugin,
      createdAt: plugin.createdAt.toISOString(),
      updatedAt: plugin.updatedAt.toISOString(),
    });
  });

  test('PUT /api/plugin/:uuid', async () => {
    Plugin.update.mockImplementationOnce(async () => {});

    const uuid = '7224835f-a10b-44d3-94b2-959580a327cf';
    const body = {
      name: 'dummy',
      type: 'dummy',
      config: { bar: 0 },
    };
    const res = await request(await appPromise)
      .put(`/api/plugin/${uuid}`)
      .send(body);

    expect(Plugin.update).toHaveBeenCalledWith(uuid, body);
    expect(res.statusCode).toEqual(200);
  });

  test('DELETE /api/plugin/:uuid', async () => {
    Plugin.del.mockImplementationOnce(async () => {});

    const uuid = '7224835f-a10b-44d3-94b2-959580a327cf';
    const res = await request(await appPromise)
      .delete(`/api/plugin/${uuid}`)
      .send();

    expect(Plugin.del).toHaveBeenCalledWith(uuid);
    expect(res.statusCode).toEqual(200);
  });

  test('POST /api/user', async () => {
    let user;

    User.create.mockImplementationOnce(async ({ plugin_uuid, native_id }) => {
      const createdAt = new Date();
      user = {
        id: 1,
        uuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
        plugin_uuid,
        createdAt,
        updatedAt: createdAt,
        native_id,
      };
      return user;
    });

    const body = {
      plugin_uuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      native_id: 'user',
    };
    const res = await request(await appPromise)
      .post('/api/user')
      .send(body);

    expect(User.create).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  });

  test('GET /api/user', async () => {
    const createdAt = new Date();
    const user = {
      id: 1,
      uuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
      plugin_uuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
      native_id: 'user',
    };

    User.readAll.mockImplementationOnce(async () => [user]);

    const res = await request(await appPromise)
      .get(`/api/user`)
      .send();

    expect(User.readAll).toHaveBeenCalledWith();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/user/:id', async () => {
    const createdAt = new Date();
    const user = {
      id: 1,
      uuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
      plugin_uuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
      native_id: 'user',
    };

    User.read.mockImplementationOnce(async () => user);

    const res = await request(await appPromise)
      .get(`/api/user/${user.id}`)
      .send();

    expect(User.read).toHaveBeenCalledWith(user.id);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  });

  test('GET /api/user/:uuid', async () => {
    const createdAt = new Date();
    const user = {
      id: 1,
      uuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
      plugin_uuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
      native_id: 'user',
    };

    User.readAllByUuid.mockImplementationOnce(async () => [user]);

    const res = await request(await appPromise)
      .get(`/api/user/${user.uuid}`)
      .send();

    expect(User.readAllByUuid).toHaveBeenCalledWith(user.uuid);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/user/:uuid/:plugin_uuid', async () => {
    const createdAt = new Date();
    const user = {
      id: 1,
      uuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
      plugin_uuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
      native_id: 'user',
    };

    User.readByUuid.mockImplementationOnce(async () => user);

    const res = await request(await appPromise)
      .get(`/api/user/${user.uuid}/${user.plugin_uuid}`)
      .send();

    expect(User.readByUuid).toHaveBeenCalledWith(user.uuid, user.plugin_uuid);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  });

  test('PUT /api/user/:id', async () => {
    User.update.mockImplementationOnce(async () => {});

    const id = 1;
    const body = {
      native_id: 'user2',
    };
    const res = await request(await appPromise)
      .put(`/api/user/${id}`)
      .send(body);

    expect(User.update).toHaveBeenCalledWith(id, body);
    expect(res.statusCode).toEqual(200);
  });

  test('PUT /api/user/:uuid/:plugin_uuid', async () => {
    User.updateByUuid.mockImplementationOnce(async () => {});

    const uuid = '3e54b9d2-e852-4bdb-97e0-6c25a405b776';
    const plugin_uuid = '7224835f-a10b-44d3-94b2-959580a327cf';
    const body = {
      native_id: 'user2',
    };
    const res = await request(await appPromise)
      .put(`/api/user/${uuid}/${plugin_uuid}`)
      .send(body);

    expect(User.updateByUuid).toHaveBeenCalledWith(uuid, plugin_uuid, body);
    expect(res.statusCode).toEqual(200);
  });

  test('DELETE /api/user/:id', async () => {
    User.del.mockImplementationOnce(async () => {});

    const id = 1;
    const res = await request(await appPromise)
      .delete(`/api/user/${id}`)
      .send();

    expect(User.del).toHaveBeenCalledWith(id);
    expect(res.statusCode).toEqual(200);
  });

  test('DELETE /api/user/:uuid/:plugin_uuid', async () => {
    User.delByUuid.mockImplementationOnce(async () => {});

    const uuid = '3e54b9d2-e852-4bdb-97e0-6c25a405b776';
    const plugin_uuid = '7224835f-a10b-44d3-94b2-959580a327cf';
    const res = await request(await appPromise)
      .delete(`/api/user/${uuid}/${plugin_uuid}`)
      .send();

    expect(User.delByUuid).toHaveBeenCalledWith(uuid, plugin_uuid);
    expect(res.statusCode).toEqual(200);
  });
});
