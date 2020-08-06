import consola from 'consola';
import Sequelize from 'sequelize';

const config = {
  dialect: 'sqlite',
  storage: './dummy_database.sqlite',
};

const sequelize = new Sequelize(config);

const Account = sequelize.import('./account.model');
const Entry = sequelize.import('./entry.model');

Entry.belongsTo(Account);

export { Account, Entry };

export async function initSequelize() {
  await sequelize.authenticate();
  consola.success('sequelize.authenticate successful');

  await sequelize.sync();
  consola.success('sequelize.sync successful');
}

export default sequelize;
