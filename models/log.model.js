export default (sequelize, Sequelize) => {
  const Account = sequelize.import('./account.model.js');

  const Log = sequelize.define('Log', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    account_uuid: {
      type: Sequelize.UUID,

      references: {
        model: Account,
        key: 'uuid',

        // This declares when to check the foreign key constraint. PostgreSQL only.
        //deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    native_location: {
      type: Sequelize.JSON,
    },
  });

  return Log;
};
