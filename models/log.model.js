export default (sequelize, Sequelize) => {
  const Account = sequelize.import('./account.model.js');

  const Log = sequelize.define('Log', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    account_id: {
      type: Sequelize.INTEGER,

      references: {
        model: Account,
        key: 'id',

        // This declares when to check the foreign key constraint. PostgreSQL only.
        //deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    savelocation: {
      type: Sequelize.JSON,
    },
  });

  return Log;
};
