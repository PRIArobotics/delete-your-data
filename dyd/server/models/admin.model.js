import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  class Admin extends Model {}
  Admin.init(
    {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING(128),
      },
      passwordHash: {
        type: Sequelize.STRING(128),
      },
    },
    {
      sequelize,
      modelName: 'admin',
      indexes: [
        {
          fields: ['username'],
          unique: true,
        },
      ],
    },
  );

  return Admin;
};
