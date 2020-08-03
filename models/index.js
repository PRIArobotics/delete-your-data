import consola from 'consola';
import Sequelize from 'sequelize';

let config;
if (process.env.NODE_ENV === 'production') {
  consola.warn({
    message: 'production DB config not implemented yet!',
    badge: true,
  });
  config = {
    dialect: 'sqlite',
    storage: './database.sqlite',
  };
} else {
  config = {
    dialect: 'sqlite',
    storage: process.env.NODE_ENV === 'test' ? './database.test.sqlite' : './database.sqlite',
  };
}

const sequelize = new Sequelize(config);

const Account = sequelize.import('./account.model');
const Log = sequelize.import('./log.model');
const Plugin = sequelize.import('./plugin.model');

Account.belongsTo(Plugin);
Log.belongsTo(Account);

export { Account, Log, Plugin };

export async function initSequelize() {
  await sequelize.authenticate();
  consola.success('sequelize.authenticate successful');

  await sequelize.sync();
  consola.success('sequelize.sync successful');
}

export default sequelize;
