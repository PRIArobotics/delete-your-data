const db = require('../../models');

const Op = db.Sequelize.Op;

module.exports.name = 'Plugin';

module.exports.create = (req, res) => {
  // get POST data
  const { name, type, config } = req.body;

  // validate data
  if (!name) {
    res.status(400).send({
      message: '`name` can not be empty!',
    });
    return;
  }

  if (!type) {
    res.status(400).send({
      message: '`type` can not be empty!',
    });
    return;
  }

  // save to database
  const plugin = { name, type, config };
  db.Plugin.create(plugin)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'An error occurred...',
      });
    });
};

module.exports.readAll = (req, res) => {
  // get GET data
  const { name } = req.query;

  // create filter
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  // query database
  db.Plugin.findAll({ where: condition })
    .then(data => {
      res.send(data);
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
