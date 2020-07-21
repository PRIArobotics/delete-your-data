const db = require('../../models');

const Op = db.Sequelize.Op;

function dbToApi({ plugin_uuid, plugin_name, config }) {
  return {
    uuid: plugin_uuid,
    name: plugin_name,
    config,
  };
}

function apiToDb({ uuid, name, config }) {
  return {
    plugin_uuid: uuid,
    plugin_name: name,
    config,
  };
}

module.exports.name = 'Plugin';

module.exports.create = (req, res) => {
  // get POST data
  const { plugin_name, config } = apiToDb(req.body);

  // validate data
  if (!plugin_name) {
    res.status(400).send({
      message: '`name` can not be empty!',
    });
    return;
  }

  // save to database
  const plugin = { plugin_name, config };
  db.Plugin.create(plugin)
    .then(data => {
      res.send(dbToApi(data));
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'An error occurred...',
      });
    });
};

module.exports.readAll = (req, res) => {
  // get GET data
  const { name: plugin_name } = req.query;

  // create filter
  var condition = plugin_name ? { plugin_name: { [Op.like]: `%${plugin_name}%` } } : null;

  // query database
  db.Plugin.findAll({ where: condition })
    .then(data => {
      res.send(data.map(dbToApi));
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'An error occurred...',
      });
    });
};

module.exports.read = (req, res) => {};

module.exports.update = (req, res) => {};

module.exports.delete = (req, res) => {};

module.exports.deleteAll = (req, res) => {};
