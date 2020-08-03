export default (sequelize, Sequelize) => {
  const Account = sequelize.import('./account.model.js');

  const Log = sequelize.define('Log', {
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
  });

  return Log;
};
