module.exports = app => {
  const consola = require('consola');
  const fs = require('fs')
  const path = require('path')
  const routes = {};

  consola.info({
    message: "Finding all Routes and Controller:",
    badge: true
  });
  fs.readdirSync(__dirname).filter((file) => file !== 'index.js')
    .forEach((file) => {
      const route = require(path.join(__dirname, file));
      route.doRouting(app);
      consola.info("Routes found: " + route.name);
      routes[route.name] = route;
    })
    consola.log("- - - - - - - - -");
    consola.success("server/routes/index.js");
    consola.log("-----------------------------------");
}
