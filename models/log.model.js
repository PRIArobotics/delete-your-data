export default (sequelize, Sequelize) => {
  const User = sequelize.import('./user.model.js');

  const Log = sequelize.define('Log', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,

      references: {
        model: User,
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
