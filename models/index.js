const consola = require('consola');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const db = {};

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

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
