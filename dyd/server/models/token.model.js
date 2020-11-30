import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  class Token extends Model {}
  Token.init(
    {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      tokenHash: {
        type: Sequelize.STRING(128),
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
