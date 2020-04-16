const db = require("../../models");
const Op = db.Sequelize.Op;

module.exports.name = 'Plugin';

module.exports.create = (req, res) => {

  if (!req.body.plugin_name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const plugin = {
    plugin_uuid: req.body.plugin_uuid,
    plugin_name: req.body.plugin_name,
    config: req.body.config
  };

  // Save Tutorial in the database
  db.Plugin.create(plugin)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "An error occurred..."
      });
    });
};

module.exports.readAll = (req, res) => {

};

module.exports.read = (req, res) => {

};

module.exports.update = (req, res) => {

};

module.exports.delete = (req, res) => {

};

module.exports.deleteAll = (req, res) => {

};
