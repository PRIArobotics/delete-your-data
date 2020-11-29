import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  class Access extends Model {}
  Access.init(
    {
      sequelize,
      modelName: 'access',
      indexes: [
        { 
          fields: ['tokenString'],
          unique: true,
        },
        
        {
          fields: ['pluginUuid'],
          unique: true,
        },
      ],
    },
  );

  return Access;
};
