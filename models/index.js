const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const db = {};

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

fs.readdirSync(__dirname).filter((file) => file !== 'index.js')
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    //console.log("Log: " + model.name);
    db[model.name] = model
  })

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
