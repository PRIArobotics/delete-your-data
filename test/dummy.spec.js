import http from 'http';
import util from 'util';
import request from 'supertest';

import appPromise from '@/server/app';
import dummyAppPromise from '@/dummyService/app';

let dummyServer, appServer, pluginUuid;

beforeAll(async () => {
  // start dummy service
  dummyServer = http.createServer(await dummyAppPromise);
  await util.promisify(dummyServer.listen).call(dummyServer, 0);
  const dummyApiUrl = `http://localhost:${dummyServer.address().port}/api`;

  // start DYD service
  appServer = http.createServer(await appPromise);
  await util.promisify(appServer.listen).call(appServer, 0);

  // register dummy plugin
  const res = await request(appServer)
    .post('/api/plugin')
    .send({
      name: 'dummy_test_plugin',
      type: 'Dummy',
      config: { apiUrl: dummyApiUrl },
    });
  expect(res.statusCode).toEqual(200);
  pluginUuid = res.body.uuid;
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
  test('it works', async () => {
    const res = await request(dummyServer)
      .get('/api/account')
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });
});
