/**
 * @jest-environment node
 */

import http from 'http';
import util from 'util';
import request from 'supertest';

import appPromise from './test_app';
import createDummyApp from 'dummy-service/lib/app';

let dummyServer, appServer, pluginUuid;

const DUMMY_PORT = 3001;
const DUMMY_API_URL = `http://localhost:${DUMMY_PORT}/api`;
const DYD_PORT = 3002;
const DYD_API_URL = `http://localhost:${DYD_PORT}/api`;

beforeAll(async () => {
  // start DYD service
  const app = await appPromise;
  appServer = http.createServer(app);
  await util.promisify(appServer.listen).call(appServer, DYD_PORT);

  // register dummy plugin
  {
    const res = await request(appServer)
      .post('/api/plugin')
      .send({
        name: 'dummy_test_plugin',
        type: 'Dummy',
        config: { apiUrl: DUMMY_API_URL },
      });
    expect(res.statusCode).toEqual(200);

    pluginUuid = res.body.uuid;
  }

  // create token
  let tokenUuid, tokenSecret;
  {
    const res = await request(appServer)
      .post('/api/token')
      .send({
        description: 'dummy',
      });
    expect(res.statusCode).toEqual(200);

    tokenUuid = res.body.uuid;
    tokenSecret = res.body.token;
  }

  // grant access
  {
    const res = await request(appServer)
      .post('/api/access')
      .send({
        pluginUuid,
        tokenUuid,
      });
    expect(res.statusCode).toEqual(200);
  }

  // start dummy service
  const dummyApp = await createDummyApp({
    dydEndpoint: DYD_API_URL,
    dydPluginUuid: pluginUuid,
    dydTokenUuid: tokenUuid,
    dydTokenSecret: tokenSecret,
  });
  dummyServer = http.createServer(dummyApp);
  await util.promisify(dummyServer.listen).call(dummyServer, DUMMY_PORT);
});

afterAll(async () => {
  // unregister dummy plugin
  const res = await request(appServer)
    .delete(`/api/plugin/${pluginUuid}`)
    .send();

  // stop DYD service
  await util.promisify(appServer.close).call(appServer);

  // stop dummy service
  await util.promisify(dummyServer.close).call(dummyServer);
});

describe('Using the Dummy service', () => {
  test('redacting an account works', async () => {
    let accountUuid;

    // create a user in the dummy service
    {
      const res = await request(dummyServer)
        .post('/api/account')
        .send({
          username: 'dummy_test_user',
        });
      expect(res.statusCode).toEqual(200);
    }

    // check it exists in DYD
    {
      const res = await request(appServer)
        .get('/api/account')
        .send({
          pluginUuid,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      accountUuid = res.body[0].uuid;
    }

    // delete the user via DYD
    {
      const res = await request(appServer)
        .post(`/api/account/redact`)
        .send({
          accounts: [accountUuid],
          mode: 'DELETE',
        });
      expect(res.statusCode).toEqual(200);
    }

    // check it doesn't exist in the dummy service
    {
      const res = await request(dummyServer)
        .get('/api/account/dummy_test_user')
        .send();
      expect(res.statusCode).toEqual(404);
    }
  });

  test('redacting a person works', async () => {
    let personUuid;

    // create a user in the dummy service
    {
      const res = await request(dummyServer)
        .post('/api/account')
        .send({
          username: 'dummy_test_user2',
        });
      expect(res.statusCode).toEqual(200);
    }

    // check it exists in DYD
    {
      const res = await request(appServer)
        .get('/api/account')
        .send({
          pluginUuid,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      personUuid = res.body[0].personUuid;
    }

    // delete the user via DYD
    {
      const res = await request(appServer)
        .post(`/api/person/redact`)
        .send({
          persons: [personUuid],
          mode: 'DELETE',
        });
      expect(res.statusCode).toEqual(200);
    }

    // check it doesn't exist in the dummy service
    {
      const res = await request(dummyServer)
        .get('/api/account/dummy_test_user2')
        .send();
      expect(res.statusCode).toEqual(404);
    }
  });

  test('redacting log entries works', async () => {
    let accountUuid, logId, nativeLogLocation;

    // create a user in the dummy service
    {
      const res = await request(dummyServer)
        .post('/api/account')
        .send({
          username: 'dummy_test_user3',
        });
      expect(res.statusCode).toEqual(200);
    }

    // check it exists in DYD
    {
      const res = await request(appServer)
        .get('/api/account')
        .send({
          pluginUuid,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      accountUuid = res.body[0].uuid;
    }

    // create an entry in the dummy service
    {
      const res = await request(dummyServer)
        .post('/api/entry')
        .send({
          username: 'dummy_test_user3',
          content: 'foo',
        });
      expect(res.statusCode).toEqual(200);
    }

    // check it exists in DYD
    {
      const res = await request(appServer)
        .get('/api/log')
        .send({
          accountUuid,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      logId = res.body[0].id;
      nativeLogLocation = res.body[0].nativeLocation;
    }

    // delete the entry via DYD
    {
      const res = await request(appServer)
        .post(`/api/log/redact`)
        .send({
          entries: [logId],
          mode: 'DELETE',
        });
      expect(res.statusCode).toEqual(200);
    }

    // check it doesn't exist in the dummy service
    {
      const res = await request(dummyServer)
        .get(`/api/entry/${nativeLogLocation}`)
        .send();
      expect(res.statusCode).toEqual(404);
    }

    // delete the user via DYD
    {
      const res = await request(appServer)
        .post(`/api/account/redact`)
        .send({
          accounts: [accountUuid],
          mode: 'DELETE',
        });
      expect(res.statusCode).toEqual(200);
    }

    // check it doesn't exist in the dummy service
    {
      const res = await request(dummyServer)
        .get('/api/account/dummy_test_user3')
        .send();
      expect(res.statusCode).toEqual(404);
    }
  });

  test('redacting accounts with log entries works', async () => {
    let accountUuid, logId, nativeLogLocation;

    // create a user in the dummy service
    {
      const res = await request(dummyServer)
        .post('/api/account')
        .send({
          username: 'dummy_test_user4',
        });
      expect(res.statusCode).toEqual(200);
    }

    // check it exists in DYD
    {
      const res = await request(appServer)
        .get('/api/account')
        .send({
          pluginUuid,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      accountUuid = res.body[0].uuid;
    }

    // create an entry in the dummy service
    {
      const res = await request(dummyServer)
        .post('/api/entry')
        .send({
          username: 'dummy_test_user4',
          content: 'foo',
        });
      expect(res.statusCode).toEqual(200);
    }

    // check it exists in DYD
    {
      const res = await request(appServer)
        .get('/api/log')
        .send({
          accountUuid,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      logId = res.body[0].id;
      nativeLogLocation = res.body[0].nativeLocation;
    }

    // delete the user via DYD
    {
      const res = await request(appServer)
        .post(`/api/account/redact`)
        .send({
          accounts: [accountUuid],
          mode: 'DELETE',
        });
      expect(res.statusCode).toEqual(200);
    }

    // check the log entry doesn't exist in the dummy service
    {
      const res = await request(dummyServer)
        .get(`/api/entry/${nativeLogLocation}`)
        .send();
      expect(res.statusCode).toEqual(404);
    }

    // check the user doesn't exist in the dummy service
    {
      const res = await request(dummyServer)
        .get('/api/account/dummy_test_user4')
        .send();
      expect(res.statusCode).toEqual(404);
    }
  });
});
