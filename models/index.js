const consola = require('consola');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const db = {};

let config;
if (process.env.NODE_ENV === 'production') {
  throw new Error('production DB config not implemented yet!');
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
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

consola.debug('sequelize: ' + db.sequelize);
consola.debug('db: ' + db);

consola.log('- - - - - - - - -');
consola.success('models/index.js');
consola.log('-----------------------------------');
module.exports = db;
