module.exports = (sequelize, Sequelize) => {
  const User = sequelize.import('./user.model.js');

  const Index = sequelize.define('Index', {
    index_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_uuid: {
      type: Sequelize.UUID,

      references: {
        model: User,
        key: 'user_uuid',

        // This declares when to check the foreign key constraint. PostgreSQL only.
        //deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    savelocation: {
      type: Sequelize.STRING(256),
    },
  });

  return Index;
};
