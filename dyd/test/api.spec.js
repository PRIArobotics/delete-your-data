/**
 * @jest-environment node
 */

import request from 'supertest';

import appPromise from './test_app';
import { Plugin, Account, Log, Token, Access } from '~/server/controller';
import { authMiddleware, requireAccess } from '~/server/auth';

jest.mock('~/server/controller/plugin.controller');
jest.mock('~/server/controller/account.controller');
jest.mock('~/server/controller/log.controller');
jest.mock('~/server/controller/token.controller');
jest.mock('~/server/controller/access.controller');
jest.mock('~/server/auth');

// stub out the auth middleware
authMiddleware.mockImplementation((_req, _res, next) => {
  next();
});

// don't check access, i.e. never throw an error
requireAccess.mockImplementation((_req, _pluginUuid) => {});

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
    Plugin.update.mockImplementationOnce(async () => ({}));

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

  test('DELETE /api/plugin', async () => {
    Plugin.delMany.mockImplementationOnce(async () => ({}));

    const body = { plugins: ['7224835f-a10b-44d3-94b2-959580a327cf'] };
    const res = await request(await appPromise)
      .delete(`/api/plugin`)
      .send(body);

    expect(Plugin.delMany).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
  });

  test('DELETE /api/plugin/:uuid', async () => {
    Plugin.del.mockImplementationOnce(async () => ({}));

    const uuid = '7224835f-a10b-44d3-94b2-959580a327cf';
    const res = await request(await appPromise)
      .delete(`/api/plugin/${uuid}`)
      .send();

    expect(Plugin.del).toHaveBeenCalledWith(uuid);
    expect(res.statusCode).toEqual(200);
  });

  test('POST /api/account', async () => {
    let account;

    Account.create.mockImplementationOnce(async ({ pluginUuid, nativeId }) => {
      const createdAt = new Date();
      account = {
        uuid: '1d47affb-74b9-42cc-920b-c97908064a79',
        personUuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
        pluginUuid,
        createdAt,
        updatedAt: createdAt,
        nativeId,
      };
      return account;
    });

    const body = {
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      nativeId: 'account',
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
      personUuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
      nativeId: 'account',
    };

    Account.readAll.mockImplementationOnce(async () => [account]);

    const res = await request(await appPromise)
      .get(`/api/account`)
      .send();

    expect(Account.readAll).toHaveBeenCalledWith({});
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
      personUuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
      nativeId: 'account',
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

  test('PUT /api/account/:uuid', async () => {
    Account.update.mockImplementationOnce(async () => ({}));

    const uuid = '1d47affb-74b9-42cc-920b-c97908064a79';
    const body = {
      nativeId: 'account2',
    };
    const res = await request(await appPromise)
      .put(`/api/account/${uuid}`)
      .send(body);

    expect(Account.update).toHaveBeenCalledWith(uuid, body);
    expect(res.statusCode).toEqual(200);
  });

  test('DELETE /api/account', async () => {
    Account.delMany.mockImplementationOnce(async () => ({}));

    const body = { accounts: ['7224835f-a10b-44d3-94b2-959580a327cf'] };
    const res = await request(await appPromise)
      .delete(`/api/account`)
      .send(body);

    expect(Account.delMany).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
  });

  test('DELETE /api/account/:uuid', async () => {
    Account.del.mockImplementationOnce(async () => ({}));

    const uuid = '1d47affb-74b9-42cc-920b-c97908064a79';
    const res = await request(await appPromise)
      .delete(`/api/account/${uuid}`)
      .send();

    expect(Account.del).toHaveBeenCalledWith(uuid);
    expect(res.statusCode).toEqual(200);
  });

  test('POST /api/log', async () => {
    let log;

    Log.create.mockImplementationOnce(async ({ accountUuid, nativeLocation }) => {
      const createdAt = new Date();
      log = {
        id: 1,
        accountUuid,
        createdAt,
        updatedAt: createdAt,
        nativeLocation,
      };
      return log;
    });

    const body = {
      accountUuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      nativeLocation: 'foo',
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
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      accountUuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      createdAt,
      updatedAt: createdAt,
      nativeLocation: 'foo',
    };

    Log.readAll.mockImplementationOnce(async () => [log]);

    const res = await request(await appPromise)
      .get(`/api/log`)
      .send();

    expect(Log.readAll).toHaveBeenCalledWith({});
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...log,
        createdAt: log.createdAt.toISOString(),
        updatedAt: log.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/log with time range', async () => {
    const createdAt = new Date();
    const log = {
      id: 1,
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      accountUuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      createdAt,
      updatedAt: createdAt,
      nativeLocation: 'foo',
    };

    Log.readAll.mockImplementationOnce(async () => [log]);

    const res = await request(await appPromise)
      .get(`/api/log?earliest=${+createdAt}&latest=${+createdAt}`)
      .send();

    expect(Log.readAll).toHaveBeenCalledWith({ earliest: createdAt, latest: createdAt });
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
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      accountUuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      createdAt,
      updatedAt: createdAt,
      nativeLocation: 'foo',
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
    Log.update.mockImplementationOnce(async () => ({}));

    const id = 1;
    const body = {
      nativeLocation: 'bar',
    };
    const res = await request(await appPromise)
      .put(`/api/log/${id}`)
      .send(body);

    expect(Log.update).toHaveBeenCalledWith(id, body);
    expect(res.statusCode).toEqual(200);
  });

  test('DELETE /api/log', async () => {
    Log.delMany.mockImplementationOnce(async () => ({}));

    const body = { entries: ['7224835f-a10b-44d3-94b2-959580a327cf'] };
    const res = await request(await appPromise)
      .delete(`/api/log`)
      .send(body);

    expect(Log.delMany).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
  });

  test('DELETE /api/log/:id', async () => {
    Log.del.mockImplementationOnce(async () => ({}));

    const id = 1;
    const res = await request(await appPromise)
      .delete(`/api/log/${id}`)
      .send();

    expect(Log.del).toHaveBeenCalledWith(id);
    expect(res.statusCode).toEqual(200);
  });

  test('POST /api/token', async () => {
    let token;

    Token.create.mockImplementationOnce(async ({ description }) => {
      const createdAt = new Date();
      token = {
        uuid: 'a3bf00d8-d7a5-4be0-aee8-2531a4cb861e',
        createdAt,
        updatedAt: createdAt,
        description,
        secret: 'secret',
      };
      return token;
    });

    const body = {
      description: 'dummy',
    };
    const res = await request(await appPromise)
      .post('/api/token')
      .send(body);

    expect(Token.create).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...token,
      createdAt: token.createdAt.toISOString(),
      updatedAt: token.updatedAt.toISOString(),
    });
  });

  test('GET /api/token', async () => {
    const createdAt = new Date();
    const token = {
      uuid: 'a3bf00d8-d7a5-4be0-aee8-2531a4cb861e',
      createdAt,
      updatedAt: createdAt,
      description: 'dummy',
    };

    Token.readAll.mockImplementationOnce(async () => [token]);

    const res = await request(await appPromise)
      .get(`/api/token`)
      .send();

    expect(Token.readAll).toHaveBeenCalledWith({});
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...token,
        createdAt: token.createdAt.toISOString(),
        updatedAt: token.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/token/:uuid', async () => {
    const createdAt = new Date();
    const token = {
      uuid: 'a3bf00d8-d7a5-4be0-aee8-2531a4cb861e',
      createdAt,
      updatedAt: createdAt,
      description: 'dummy',
    };

    Token.read.mockImplementationOnce(async () => token);

    const res = await request(await appPromise)
      .get(`/api/token/${token.uuid}`)
      .send();

    expect(Token.read).toHaveBeenCalledWith(token.uuid);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...token,
      createdAt: token.createdAt.toISOString(),
      updatedAt: token.updatedAt.toISOString(),
    });
  });

  test('DELETE /api/token', async () => {
    Token.delMany.mockImplementationOnce(async () => ({}));

    const body = { tokens: ['a3bf00d8-d7a5-4be0-aee8-2531a4cb861e'] };
    const res = await request(await appPromise)
      .delete(`/api/token`)
      .send(body);

    expect(Token.delMany).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
  });

  test('DELETE /api/token/:uuid', async () => {
    Token.del.mockImplementationOnce(async () => ({}));

    const uuid = 'a3bf00d8-d7a5-4be0-aee8-2531a4cb861e';
    const res = await request(await appPromise)
      .delete(`/api/token/${uuid}`)
      .send();

    expect(Token.del).toHaveBeenCalledWith(uuid);
    expect(res.statusCode).toEqual(200);
  });

  test('POST /api/access', async () => {
    let access;

    Access.create.mockImplementationOnce(async ({ tokenUuid, pluginUuid }) => {
      const createdAt = new Date();
      access = {
        tokenUuid,
        pluginUuid,
        createdAt,
        updatedAt: createdAt,
      };
      return access;
    });

    const body = {
      tokenUuid: 'a3bf00d8-d7a5-4be0-aee8-2531a4cb861e',
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
    };
    const res = await request(await appPromise)
      .post('/api/access')
      .send(body);

    expect(Access.create).toHaveBeenCalledWith(body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...access,
      createdAt: access.createdAt.toISOString(),
      updatedAt: access.updatedAt.toISOString(),
    });
  });

  test('GET /api/access', async () => {
    const createdAt = new Date();
    const access = {
      tokenUuid: 'a3bf00d8-d7a5-4be0-aee8-2531a4cb861e',
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
    };

    Access.readAll.mockImplementationOnce(async () => [access]);

    const res = await request(await appPromise)
      .get(`/api/access`)
      .send();

    expect(Access.readAll).toHaveBeenCalledWith({});
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...access,
        createdAt: access.createdAt.toISOString(),
        updatedAt: access.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/token/:tokenUuid/access', async () => {
    const createdAt = new Date();
    const access = {
      tokenUuid: 'a3bf00d8-d7a5-4be0-aee8-2531a4cb861e',
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
    };

    Access.readAll.mockImplementationOnce(async () => [access]);

    const res = await request(await appPromise)
      .get(`/api/token/${access.tokenUuid}/access`)
      .send();

    expect(Access.readAll).toHaveBeenCalledWith({});
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...access,
        createdAt: access.createdAt.toISOString(),
        updatedAt: access.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/token/:tokenUuid/access/:pluginUuid', async () => {
    const createdAt = new Date();
    const access = {
      tokenUuid: 'a3bf00d8-d7a5-4be0-aee8-2531a4cb861e',
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
    };

    Access.read.mockImplementationOnce(async () => access);

    const res = await request(await appPromise)
      .get(`/api/token/${access.tokenUuid}/access/${access.pluginUuid}`)
      .send();

    expect(Access.read).toHaveBeenCalledWith(access.pluginUuid, access.tokenUuid);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...access,
      createdAt: access.createdAt.toISOString(),
      updatedAt: access.updatedAt.toISOString(),
    });
  });

  test('DELETE /api/token/:tokenUuid/access/:pluginUuid', async () => {
    Access.del.mockImplementationOnce(async () => ({}));

    const tokenUuid = 'a3bf00d8-d7a5-4be0-aee8-2531a4cb861e';
    const pluginUuid = '7224835f-a10b-44d3-94b2-959580a327cf';
    const res = await request(await appPromise)
      .delete(`/api/token/${tokenUuid}/access/${pluginUuid}`)
      .send();

    expect(Access.del).toHaveBeenCalledWith(pluginUuid, tokenUuid);
    expect(res.statusCode).toEqual(200);
  });

  test('GET /api/account/:uuid/log', async () => {
    const createdAt = new Date();
    const log = {
      id: 1,
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      accountUuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      createdAt,
      updatedAt: createdAt,
      nativeLocation: 'foo',
    };

    Log.readAll.mockImplementationOnce(async () => [log]);

    const accountUuid = log.accountUuid;
    const res = await request(await appPromise)
      .get(`/api/account/${accountUuid}/log`)
      .send();

    expect(Log.readAll).toHaveBeenCalledWith({ accountUuid });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...log,
        createdAt: log.createdAt.toISOString(),
        updatedAt: log.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/person/:uuid/account', async () => {
    const createdAt = new Date();
    const account = {
      uuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      personUuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
      nativeId: 'account',
    };

    Account.readAll.mockImplementationOnce(async () => [account]);

    const personUuid = account.personUuid;
    const res = await request(await appPromise)
      .get(`/api/person/${personUuid}/account`)
      .send();

    expect(Account.readAll).toHaveBeenCalledWith({ personUuid });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...account,
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/person/:uuid/log', async () => {
    const createdAt = new Date();
    const log = {
      id: 1,
      accountUuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      createdAt,
      updatedAt: createdAt,
      nativeLocation: 'foo',
    };

    Log.readAll.mockImplementationOnce(async () => [log]);

    const personUuid = '3e54b9d2-e852-4bdb-97e0-6c25a405b776';
    const res = await request(await appPromise)
      .get(`/api/person/${personUuid}/log`)
      .send();

    expect(Log.readAll).toHaveBeenCalledWith({ personUuid });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...log,
        createdAt: log.createdAt.toISOString(),
        updatedAt: log.updatedAt.toISOString(),
      },
    ]);
  });

  test('POST /api/plugin/:pluginUuid/account', async () => {
    let account;

    Account.create.mockImplementationOnce(async ({ pluginUuid, nativeId }) => {
      const createdAt = new Date();
      account = {
        uuid: '1d47affb-74b9-42cc-920b-c97908064a79',
        personUuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
        pluginUuid,
        createdAt,
        updatedAt: createdAt,
        nativeId,
      };
      return account;
    });

    const pluginUuid = '7224835f-a10b-44d3-94b2-959580a327cf';
    const body = {
      nativeId: 'account',
    };
    const res = await request(await appPromise)
      .post(`/api/plugin/${pluginUuid}/account/`)
      .send(body);

    expect(Account.create).toHaveBeenCalledWith({ pluginUuid, ...body });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...account,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    });
  });

  test('GET /api/plugin/:pluginUuid/account', async () => {
    const createdAt = new Date();
    const account = {
      uuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      personUuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
      nativeId: 'account',
    };

    Account.readAll.mockImplementationOnce(async () => [account]);

    const res = await request(await appPromise)
      .get(`/api/plugin/${account.pluginUuid}/account`)
      .send();

    expect(Account.readAll).toHaveBeenCalledWith({ pluginUuid: account.pluginUuid });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...account,
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/plugin/:pluginUuid/account/:nativeId', async () => {
    const createdAt = new Date();
    const account = {
      uuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      personUuid: '3e54b9d2-e852-4bdb-97e0-6c25a405b776',
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      createdAt,
      updatedAt: createdAt,
      nativeId: { username: 'acc/ount' },
    };

    Account.readByNativeId.mockImplementationOnce(async () => account);

    const nativeIdEnc = encodeURIComponent(JSON.stringify(account.nativeId));
    const res = await request(await appPromise)
      .get(`/api/plugin/${account.pluginUuid}/account/${nativeIdEnc}`)
      .send();

    expect(requireAccess).toHaveBeenCalledWith(
      expect.anything(),
      '7224835f-a10b-44d3-94b2-959580a327cf',
    );
    expect(Account.readByNativeId).toHaveBeenCalledWith({
      pluginUuid: account.pluginUuid,
      nativeId: account.nativeId,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...account,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    });
  });

  test('PATCH /api/plugin/:pluginUuid/account/:nativeId', async () => {
    Account.updateByNativeId.mockImplementationOnce(async () => ({}));

    const pluginUuid = '7224835f-a10b-44d3-94b2-959580a327cf';
    const nativeId = 'account';
    const body = {
      nativeId: 'account2',
    };
    const nativeIdEnc = encodeURIComponent(JSON.stringify(nativeId));
    const res = await request(await appPromise)
      .patch(`/api/plugin/${pluginUuid}/account/${nativeIdEnc}`)
      .send(body);

    expect(requireAccess).toHaveBeenCalledWith(
      expect.anything(),
      '7224835f-a10b-44d3-94b2-959580a327cf',
    );
    expect(Account.updateByNativeId).toHaveBeenCalledWith({ pluginUuid, nativeId }, body);
    expect(res.statusCode).toEqual(200);
  });

  test('DELETE /api/plugin/:pluginUuid/account/:nativeId', async () => {
    Account.delByNativeId.mockImplementationOnce(async () => ({}));

    const pluginUuid = '7224835f-a10b-44d3-94b2-959580a327cf';
    const nativeId = 'account';
    const nativeIdEnc = encodeURIComponent(JSON.stringify(nativeId));
    const res = await request(await appPromise)
      .delete(`/api/plugin/${pluginUuid}/account/${nativeIdEnc}`)
      .send();

    expect(requireAccess).toHaveBeenCalledWith(
      expect.anything(),
      '7224835f-a10b-44d3-94b2-959580a327cf',
    );
    expect(Account.delByNativeId).toHaveBeenCalledWith({ pluginUuid, nativeId });
    expect(res.statusCode).toEqual(200);
  });

  test('POST /api/plugin/:pluginUuid/log', async () => {
    let log;

    Log.create.mockImplementationOnce(async ({ accountUuid, nativeLocation }) => {
      const createdAt = new Date();
      log = {
        id: 1,
        accountUuid,
        createdAt,
        updatedAt: createdAt,
        nativeLocation,
      };
      return log;
    });

    const pluginUuid = '7224835f-a10b-44d3-94b2-959580a327cf';
    const body = {
      accountUuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      nativeLocation: 'foo',
    };
    const res = await request(await appPromise)
      .post(`/api/plugin/${pluginUuid}/log/`)
      .send(body);

    expect(Log.create).toHaveBeenCalledWith({ pluginUuid, ...body });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...log,
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),
    });
  });

  test('GET /api/plugin/:pluginUuid/log', async () => {
    const createdAt = new Date();
    const log = {
      id: 1,
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      accountUuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      createdAt,
      updatedAt: createdAt,
      nativeLocation: 'foo',
    };

    Log.readAll.mockImplementationOnce(async () => [log]);

    const res = await request(await appPromise)
      .get(`/api/plugin/${log.pluginUuid}/log`)
      .send();

    expect(Log.readAll).toHaveBeenCalledWith({ pluginUuid: log.pluginUuid });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...log,
        createdAt: log.createdAt.toISOString(),
        updatedAt: log.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/plugin/:pluginUuid/log with time range', async () => {
    const createdAt = new Date();
    const log = {
      id: 1,
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      accountUuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      createdAt,
      updatedAt: createdAt,
      nativeLocation: 'foo',
    };

    Log.readAll.mockImplementationOnce(async () => [log]);

    const res = await request(await appPromise)
      .get(`/api/plugin/${log.pluginUuid}/log?earliest=${+createdAt}&latest=${+createdAt}`)
      .send();

    expect(Log.readAll).toHaveBeenCalledWith({
      pluginUuid: log.pluginUuid,
      earliest: createdAt,
      latest: createdAt,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        ...log,
        createdAt: log.createdAt.toISOString(),
        updatedAt: log.updatedAt.toISOString(),
      },
    ]);
  });

  test('GET /api/plugin/:pluginUuid/log/:nativeLocation', async () => {
    const createdAt = new Date();
    const log = {
      id: 1,
      pluginUuid: '7224835f-a10b-44d3-94b2-959580a327cf',
      accountUuid: '1d47affb-74b9-42cc-920b-c97908064a79',
      createdAt,
      updatedAt: createdAt,
      nativeLocation: 'foo',
    };

    Log.readByNativeLocation.mockImplementationOnce(async () => log);

    const nativeLocationEnc = encodeURIComponent(JSON.stringify(log.nativeLocation));
    const res = await request(await appPromise)
      .get(`/api/plugin/${log.pluginUuid}/log/${nativeLocationEnc}`)
      .send();

    expect(requireAccess).toHaveBeenCalledWith(
      expect.anything(),
      '7224835f-a10b-44d3-94b2-959580a327cf',
    );
    expect(Log.readByNativeLocation).toHaveBeenCalledWith({
      pluginUuid: log.pluginUuid,
      nativeLocation: log.nativeLocation,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ...log,
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),
    });
  });

  test('PATCH /api/plugin/:pluginUuid/log/:nativeLocation', async () => {
    Log.updateByNativeLocation.mockImplementationOnce(async () => ({}));

    const pluginUuid = '7224835f-a10b-44d3-94b2-959580a327cf';
    const nativeLocation = 'foo';
    const body = {
      nativeId: 'account2',
    };
    const nativeLocationEnc = encodeURIComponent(JSON.stringify(nativeLocation));
    const res = await request(await appPromise)
      .patch(`/api/plugin/${pluginUuid}/log/${nativeLocationEnc}`)
      .send(body);

    expect(requireAccess).toHaveBeenCalledWith(
      expect.anything(),
      '7224835f-a10b-44d3-94b2-959580a327cf',
    );
    expect(Log.updateByNativeLocation).toHaveBeenCalledWith({ pluginUuid, nativeLocation }, body);
    expect(res.statusCode).toEqual(200);
  });

  test('DELETE /api/plugin/:pluginUuid/log/:nativeLocation', async () => {
    Log.delByNativeLocation.mockImplementationOnce(async () => ({}));

    const pluginUuid = '7224835f-a10b-44d3-94b2-959580a327cf';
    const nativeLocation = 'foo';
    const nativeLocationEnc = encodeURIComponent(JSON.stringify(nativeLocation));
    const res = await request(await appPromise)
      .delete(`/api/plugin/${pluginUuid}/log/${nativeLocationEnc}`)
      .send();

    expect(requireAccess).toHaveBeenCalledWith(
      expect.anything(),
      '7224835f-a10b-44d3-94b2-959580a327cf',
    );
    expect(Log.delByNativeLocation).toHaveBeenCalledWith({ pluginUuid, nativeLocation });
    expect(res.statusCode).toEqual(200);
  });
});
