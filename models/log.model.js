import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  class Log extends Model {}
  Log.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // accountUuid defined as an association
      nativeLocation: {
        type: Sequelize.JSON,
      },
    },
    {
      sequelize,
      modelName: 'log',
    },
  );

  return Log;
};
