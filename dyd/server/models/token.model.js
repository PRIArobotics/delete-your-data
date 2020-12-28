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
      description: {
        type: Sequelize.STRING(128),
      },
      secretHash: {
        type: Sequelize.STRING(128),
      },
    },
    {
      sequelize,
      modelName: 'token',
    },
  );

  return Token;
};
