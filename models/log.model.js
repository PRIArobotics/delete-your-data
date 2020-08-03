import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  const Account = sequelize.import('./account.model.js');

  class Log extends Model {}
  Log.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      accountUuid: {
        type: Sequelize.UUID,

        references: {
          model: Account,
          key: 'uuid',

          // This declares when to check the foreign key constraint. PostgreSQL only.
          //deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
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
