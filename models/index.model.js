const { User } = require('./user.model.js');
const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Index = sequelize.define('Index', {
    index_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_uuid: {
      type: DataTypes.UUID,

      references: {
        model: User,
        key: 'user_uuid',

        // This declares when to check the foreign key constraint. PostgreSQL only.
        //deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    savelocation: {
      type: DataTypes.STRING(256),
    },
  });

  return Index;
}
