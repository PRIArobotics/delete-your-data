import http from 'http';
import util from 'util';
import request from 'supertest';

// import appPromise from '@/server/app';
import dummyAppPromise from '@/dummyService/app';

let dummyServer;

beforeAll(async () => {
  dummyServer = http.createServer(await dummyAppPromise);
  await util.promisify(dummyServer.listen).call(dummyServer, 0);
  const dummyApiUrl = `http://localhost:${dummyServer.address().port}/api`;
});

afterAll(async () => {
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
