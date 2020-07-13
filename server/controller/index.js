const consola = require('consola');
const fs = require('fs')
const path = require('path')
const cntr = {};

fs.readdirSync(__dirname).filter((file) => file.endsWith('.controller.js'))
  .forEach((file) => {
    const controller = require(path.join(__dirname, file));
    consola.info("Controller loaded: " + controller.name);
    cntr[controller.name] = controller
  })

module.exports = cntr

consola.log("- - - - - - - - -");
consola.success("server/controller/index.js");
consola.log("-----------------------------------");
