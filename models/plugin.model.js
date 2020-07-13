module.exports = (sequelize, Sequelize) => {
  const Plugin = sequelize.define('Plugin', {
    plugin_uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    plugin_name: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    config: {
      type: Sequelize.JSON,
    },
  });

  return Plugin;
};
