import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  class Access extends Model {}
  Access.init(
    {
    },
    {
      sequelize,
      modelName: 'access',
      indexes: [
        { 
          fields: ['tokenString', 'pluginUuid'],
          unique: true,
        },
      ],
    },
  );

  return Access;
};
