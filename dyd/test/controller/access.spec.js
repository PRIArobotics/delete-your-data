/**
 * @jest-environment node
 */

import httpErrors from 'httperrors';

import { initSequelize } from '~/server/models';
import { Plugin, Token, Access } from '~/server/controller';

let pluginUuid, tokenUuid;

beforeAll(async () => {
  await initSequelize();

  const plugin = await Plugin.create({
    name: 'access_test_plugin',
    type: 'access_test_plugin',
    config: { foo: 0 },
  });

  pluginUuid = plugin.uuid;

  const token = await Token.create({
    description: 'access_test_plugin',
  });

  tokenUuid = token.uuid;
});

afterAll(async () => {
  await Plugin.del(pluginUuid);
  await Token.del(tokenUuid);
});

describe('Token Controller', () => {
  test('it works', async () => {
    // create
    {
      const access = await Access.create({ pluginUuid, tokenUuid });
      // toMatchObject because sequelize model instances are not plain objects
      expect(access).toMatchObject({
        pluginUuid,
        tokenUuid,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    }

    // create errors
    await expect(Access.create({ pluginUuid })).rejects.toThrow(httpErrors[400]);
    await expect(Access.create({ tokenUuid })).rejects.toThrow(httpErrors[400]);
    await expect(Access.create({ pluginUuid, tokenUuid })).rejects.toThrow(httpErrors[400]);

    // read all
    {
      const accesses = await Access.readAll({ pluginUuid });
      // toMatchObject because sequelize model instances are not plain objects
      expect(accesses).toMatchObject([{ pluginUuid, tokenUuid }]);
    }
    {
      const accesses = await Access.readAll({ tokenUuid });
      // toMatchObject because sequelize model instances are not plain objects
      expect(accesses).toMatchObject([{
        pluginUuid,
        tokenUuid,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }]);
    }
    {
      const accesses = await Access.readAll({ pluginUuid, tokenUuid });
      // toMatchObject because sequelize model instances are not plain objects
      expect(accesses).toMatchObject([{
        pluginUuid,
        tokenUuid,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }]);
    }

    // read
    {
      const access = await Access.read(pluginUuid, tokenUuid);
      // toMatchObject because sequelize model instances are not plain objects
      expect(access).toMatchObject({
        pluginUuid,
        tokenUuid,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    }

    // read errors

    await expect(Access.read('7224835f-a10b-44d3-94b2-959580a327cf', tokenUuid)).rejects.toThrow(
      httpErrors[404],
    );

    // delete
    {
      await Access.del(pluginUuid, tokenUuid);

      expect(await Access.readAll({ pluginUuid })).toHaveLength(0);
    }

    // delete errors

    await expect(Access.del('7224835f-a10b-44d3-94b2-959580a327cf', tokenUuid)).rejects.toThrow(
      httpErrors[404],
    );
  });
});
