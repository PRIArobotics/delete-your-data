import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  class Plugin extends Model {}
  Plugin.init(
    {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      config: {
        type: Sequelize.JSON,
      },
    },
    {
      sequelize,
      modelName: 'plugin',
    },
  );

  return Plugin;
};
