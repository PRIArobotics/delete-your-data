const { Plugin } = require('./plugin.model.js');
const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    plugin_uuid: {
      type: DataTypes.UUID,

      references: {
        model: Plugin,
        key: 'plugin_uuid',
        
        // This declares when to check the foreign key constraint. PostgreSQL only.
        //deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    native_id: {
      type: DataTypes.STRING(256),
    },
  });

  return User;
}
