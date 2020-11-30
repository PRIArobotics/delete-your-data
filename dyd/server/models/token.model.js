import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  class Token extends Model {}
  Token.init(
    {

      tokenString: {
        type: Sequelize.STRING(128),
        primaryKey: true,
      },
      description: {
        type: Sequelize.STRING(64),
      },

    },
    {
      sequelize,
      modelName: 'token',
    },
  );

  return Token;
};
