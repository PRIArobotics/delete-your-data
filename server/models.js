const Model = Sequelize.Model;

class Plugins extends Model {}
Plugins.init({
  // attributes
  plugin_uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  plugin_name: {
    type: Sequelize.STRING(128),
    allowNull: false
  },
  config: {
      type: Sequelize.JSON
  }
}, { sequelize, modelName: 'plugins' });


class Users extends Model {}
Users.init({
  // attributes
  user_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  plugin_uuid: {
      type: Sequelize.UUID,

      references: {
        // This is a reference to another model
        model: Plugins,
   
        // This is the column name of the referenced model
        key: 'plugin_uuid',
   
        // This declares when to check the foreign key constraint. PostgreSQL only.
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
  },
  native_id: {
      type: Sequelize.STRING(256)
  }
}, { sequelize, modelName: 'users' });


class Index extends Model {}
Index.init({
  // attributes
  index_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_uuid: {
      type: Sequelize.UUID,

      references: {
        // This is a reference to another model
        model: Users,
   
        // This is the column name of the referenced model
        key: 'user_uuid',
   
        // This declares when to check the foreign key constraint. PostgreSQL only.
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
  },
  savelocation: {
      type: Sequelize.STRING(256)
  }
}, { sequelize, modelName: 'index' });