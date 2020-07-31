import request from 'supertest';

import appPromise from '@/server/app';
import { Plugin, Account, Log } from '~/server/controller';

jest.mock('~/server/controller/plugin.controller');
jest.mock('~/server/controller/account.controller');
jest.mock('~/server/controller/log.controller');

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

  test('POST /api/account', async () => {
    let account;

    Account.create.mockImplementationOnce(async ({ plugin_uuid, native_id }) => {
      const createdAt = new Date();
      account = {
        uuid: '1d47affb-74b9-42cc-920b-c97908064a79',
        person_uuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
        plugin_uuid,
        createdAt,
        updatedAt: createdAt,
        native_id,
      };
      return account;
    });

    const body = {
      plugin_uuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      native_id: 'account',
    };
    const res = await request(await appPromise)
      .post('/api/account')
      .send(body);

    expect(Account.create).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...account,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    });
  });

  test('GET /api/account', async () => {
    const createdAt = new Date();
    const account = {
      uuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      person_uuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
      plugin_uuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
      native_id: 'account',
    };

    Account.readAll.mockImplementationOnce(async () => [account]);

    const res = await request(await appPromise)
      .get(`/api/account`)
      .send();

    expect(Account.readAll).toHaveBeenCalledWith();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...account,
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/account/:uuid', async () => {
    const createdAt = new Date();
    const account = {
      uuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      person_uuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
      plugin_uuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
      native_id: 'account',
    };

    Account.read.mockImplementationOnce(async () => account);

    const res = await request(await appPromise)
      .get(`/api/account/${account.uuid}`)
      .send();

    expect(Account.read).toHaveBeenCalledWith(account.uuid);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...account,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    });
  });

  // test('GET /api/account/:person_uuid', async () => {
  //   const createdAt = new Date();
  //   const account = {
  //     id: 1,
  //     person_uuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
  //     plugin_uuid: '7224835f-a10b-44d3-94b2-959580a327cf',
  //     createdAt,
  //     updatedAt: createdAt,
  //     native_id: 'account',
  //   };

  //   Account.readAllByUuid.mockImplementationOnce(async () => [account]);

  //   const res = await request(await appPromise)
  //     .get(`/api/account/${account.person_uuid}`)
  //     .send();

  //   expect(Account.readAllByUuid).toHaveBeenCalledWith(account.person_uuid);
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body).toEqual([
  //     {
  //       ...account,
  //       createdAt: account.createdAt.toISOString(),
  //       updatedAt: account.updatedAt.toISOString(),
  //     },
  //   ]);
  // });

  // test('GET /api/account/:person_uuid/:plugin_uuid', async () => {
  //   const createdAt = new Date();
  //   const account = {
  //     id: 1,
  //     person_uuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
  //     plugin_uuid: '7224835f-a10b-44d3-94b2-959580a327cf',
  //     createdAt,
  //     updatedAt: createdAt,
  //     native_id: 'account',
  //   };

  //   Account.readByUuid.mockImplementationOnce(async () => account);

  //   const res = await request(await appPromise)
  //     .get(`/api/account/${account.person_uuid}/${account.plugin_uuid}`)
  //     .send();

  //   expect(Account.readByUuid).toHaveBeenCalledWith(account.person_uuid, account.plugin_uuid);
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body).toEqual({
  //     ...account,
  //     createdAt: account.createdAt.toISOString(),
  //     updatedAt: account.updatedAt.toISOString(),
  //   });
  // });

  test('PUT /api/account/:uuid', async () => {
    Account.update.mockImplementationOnce(async () => {});

    const uuid = '1d47affb-74b9-42cc-920b-c97908064a79';
    const body = {
      native_id: 'account2',
    };
    const res = await request(await appPromise)
      .put(`/api/account/${uuid}`)
      .send(body);

    expect(Account.update).toHaveBeenCalledWith(uuid, body);
    expect(res.statusCode).toEqual(200);
  });

  // test('PUT /api/account/:person_uuid/:plugin_uuid', async () => {
  //   Account.updateByUuid.mockImplementationOnce(async () => {});

  //   const person_uuid = '3e54b9d2-e852-4bdb-97e0-6c25a405b776';
  //   const plugin_uuid = '7224835f-a10b-44d3-94b2-959580a327cf';
  //   const body = {
  //     native_id: 'account2',
  //   };
  //   const res = await request(await appPromise)
  //     .put(`/api/account/${person_uuid}/${plugin_uuid}`)
  //     .send(body);

  //   expect(Account.updateByUuid).toHaveBeenCalledWith(person_uuid, plugin_uuid, body);
  //   expect(res.statusCode).toEqual(200);
  // });

  test('DELETE /api/account/:uuid', async () => {
    Account.del.mockImplementationOnce(async () => {});

    const uuid = '1d47affb-74b9-42cc-920b-c97908064a79';
    const res = await request(await appPromise)
      .delete(`/api/account/${uuid}`)
      .send();

    expect(Account.del).toHaveBeenCalledWith(uuid);
    expect(res.statusCode).toEqual(200);
  });

  // test('DELETE /api/account/:person_uuid/:plugin_uuid', async () => {
  //   Account.delByUuid.mockImplementationOnce(async () => {});

  //   const person_uuid = '3e54b9d2-e852-4bdb-97e0-6c25a405b776';
  //   const plugin_uuid = '7224835f-a10b-44d3-94b2-959580a327cf';
  //   const res = await request(await appPromise)
  //     .delete(`/api/account/${person_uuid}/${plugin_uuid}`)
  //     .send();

  //   expect(Account.delByUuid).toHaveBeenCalledWith(person_uuid, plugin_uuid);
  //   expect(res.statusCode).toEqual(200);
  // });

  test('POST /api/log', async () => {
    let log;

    Log.create.mockImplementationOnce(async ({ account_uuid, native_location }) => {
      const createdAt = new Date();
      log = {
        id: 1,
        account_uuid,
        createdAt,
        updatedAt: createdAt,
        native_location,
      };
      return log;
    });

    const body = {
      account_uuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      native_location: 'foo',
    };
    const res = await request(await appPromise)
      .post('/api/log')
      .send(body);

    expect(Log.create).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...log,
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),
    });
  });

  test('GET /api/log', async () => {
    const createdAt = new Date();
    const log = {
      id: 1,
      account_uuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      createdAt,
      updatedAt: createdAt,
      native_location: 'foo',
    };

    Log.readAll.mockImplementationOnce(async () => [log]);

    const res = await request(await appPromise)
      .get(`/api/log`)
      .send();

    expect(Log.readAll).toHaveBeenCalledWith();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...log,
        createdAt: log.createdAt.toISOString(),
        updatedAt: log.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/log/:id', async () => {
    const createdAt = new Date();
    const log = {
      id: 1,
      account_uuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      createdAt,
      updatedAt: createdAt,
      native_location: 'foo',
    };

    Log.read.mockImplementationOnce(async () => log);

    const res = await request(await appPromise)
      .get(`/api/log/${log.id}`)
      .send();

    expect(Log.read).toHaveBeenCalledWith(log.id);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...log,
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),
    });
  });

  test('PUT /api/log/:id', async () => {
    Log.update.mockImplementationOnce(async () => {});

    const id = 1;
    const body = {
      native_location: 'bar',
    };
    const res = await request(await appPromise)
      .put(`/api/log/${id}`)
      .send(body);

    expect(Log.update).toHaveBeenCalledWith(id, body);
    expect(res.statusCode).toEqual(200);
  });

  test('DELETE /api/log/:id', async () => {
    Log.del.mockImplementationOnce(async () => {});

    const id = 1;
    const res = await request(await appPromise)
      .delete(`/api/log/${id}`)
      .send();

    expect(Log.del).toHaveBeenCalledWith(id);
    expect(res.statusCode).toEqual(200);
  });
});
