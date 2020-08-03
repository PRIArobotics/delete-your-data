import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
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
      // pluginUuid defined as an association
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
