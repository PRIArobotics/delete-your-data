module.exports = (sequelize, Sequelize) => {
  const Plugin = sequelize.import('./plugin.model.js');

  const User = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    plugin_uuid: {
      type: Sequelize.UUID,

      references: {
        model: Plugin,
        key: 'uuid',

        // This declares when to check the foreign key constraint. PostgreSQL only.
        //deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    native_id: {
      type: Sequelize.STRING(256),
    },
  });

  return User;
};
