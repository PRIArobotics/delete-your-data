import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  class Account extends Model {}
  Account.init(
    {
      username: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'account',
    },
  );

  return Account;
};
