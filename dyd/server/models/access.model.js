import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  class Access extends Model {}
  Access.init(
    {
      // tokenUuid defined as an association
      // pluginUuid defined as an association
    },
    {
      sequelize,
      modelName: 'access',
      indexes: [
        {
          fields: ['tokenUuid', 'pluginUuid'],
          unique: true,
        },
      ],
    },
  );

  return Access;
};
