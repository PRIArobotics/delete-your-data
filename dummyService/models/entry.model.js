import Sequelize, { Model } from 'sequelize';

export default (sequelize) => {
  class Entry extends Model {}
  Entry.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // accountUsername defined as an association
      content: {
        type: Sequelize.STRING,
      },
    },
    {
      sequelize,
      modelName: 'entry',
      indexes: [{ fields: ['accountUsername'] }],
    },
  );

  return Entry;
};
