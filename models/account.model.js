import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  const Plugin = sequelize.import('./plugin.model.js');

  class Account extends Model {}
  Account.init(
    {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      personUuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      pluginUuid: {
        type: Sequelize.UUID,

        references: {
          model: Plugin,
          key: 'uuid',

          // This declares when to check the foreign key constraint. PostgreSQL only.
          //deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      nativeId: {
        type: Sequelize.JSON,
      },
    },
    {
      sequelize,
      modelName: 'account',
    },
  );

  return Account;
};
