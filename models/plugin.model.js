module.exports = (sequelize, Sequelize) => {
  const Plugin = sequelize.define('Plugin', {
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    config: {
      type: Sequelize.JSON,
    },
  });

  return Plugin;
};
