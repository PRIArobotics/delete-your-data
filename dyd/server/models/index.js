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
const Token = sequelize.import('./token.model');
const Access = sequelize.import('./access.model');

Account.belongsTo(Plugin);
Log.belongsTo(Account);
Account.hasMany(Log);
Access.belongsTo(Token);
Access.belongsTo(Plugin);

export { Account, Log, Plugin, Token, Access };

export async function initSequelize() {
  await sequelize.authenticate();
  consola.success('sequelize.authenticate successful');

  await sequelize.sync();
  consola.success('sequelize.sync successful');
}

export default sequelize;
