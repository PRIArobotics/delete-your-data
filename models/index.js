import consola from 'consola';
import fs from 'fs';
import path from 'path';
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

consola.log('--------- models/index.js ---------');
consola.info({
  message: 'Finding all Models:',
  badge: true,
});
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.model.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    consola.info('Model loaded: ' + model.name);
    module.exports[model.name] = model;
  });

export default sequelize;

consola.log('- - - - - - - - -');
consola.success('models/index.js');
consola.log('-----------------------------------');
