/**
 * @jest-environment node
 */

import httpErrors from 'httperrors';

import { initSequelize } from '~/server/models';
import { Token } from '~/server/controller';

beforeAll(async () => {
  await initSequelize();
});

describe('Token Controller', () => {
  test('it works', async () => {
    let uuid, secret;

    // create
    {
      const token = await Token.create({
        description: 'token_test',
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(token).toMatchObject({
        uuid: expect.any(String),
        description: 'token_test',
        secret: expect.any(String),
      });

      uuid = token.uuid;
      secret = token.secret;
    }

    // create errors
    await expect(Token.create({})).rejects.toThrow(httpErrors[400]);

    // read all
    {
      const tokens = await Token.readAll({ description: 'token_test' });
      // toMatchObject because sequelize model instances are not plain objects
      expect(tokens).toMatchObject([
        {
          uuid: expect.any(String),
          description: 'token_test',
        },
      ]);
      expect(tokens[0]).not.toHaveProperty('secret');
      expect(tokens[0]).not.toHaveProperty('secretHash');
    }

    // read
    {
      const token = await Token.read(uuid);
      // toMatchObject because sequelize model instances are not plain objects
      expect(token).toMatchObject({
        uuid: expect.any(String),
        description: 'token_test',
      });
      expect(token).not.toHaveProperty('secret');
      expect(token).not.toHaveProperty('secretHash');
    }

    // read errors

    await expect(Token.read('7224835f-a10b-44d3-94b2-959580a327cf')).rejects.toThrow(
      httpErrors[404],
    );

    // check
    {
      expect(await Token.check(uuid, secret)).toBe(true);
      expect(await Token.check('7224835f-a10b-44d3-94b2-959580a327cf', secret)).toBe(false);
      expect(await Token.check(uuid, 'secret')).toBe(false);
    }

    // delete
    {
      await Token.del(uuid);

      expect(await Token.readAll({ description: 'token_test' })).toHaveLength(0);
    }

    // delete errors

    await expect(Token.del('7224835f-a10b-44d3-94b2-959580a327cf')).rejects.toThrow(
      httpErrors[404],
    );

    // create new test token
    {
      const token = await Token.create({
        description: 'token_test',
      });
      // toMatchObject because sequelize model instances are not plain objects
      expect(token).toMatchObject({
        uuid: expect.any(String),
        description: 'token_test',
        secret: expect.any(String),
      });

      uuid = token.uuid;
      secret = token.secret;
    }

    // delete many
    {
      await Token.delMany({ tokens: [uuid] });

      expect(await Token.readAll({ description: 'token_test' })).toHaveLength(0);
    }

    // delete many errors

    await expect(Token.delMany({})).rejects.toThrow(httpErrors[400]);

    await expect(
      Token.delMany({ tokens: ['1d47affb-74b9-42cc-920b-c97908064a79'] }),
    ).rejects.toThrow(httpErrors[404]);
  });
});
