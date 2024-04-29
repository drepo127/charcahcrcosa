var DataTypes = require("sequelize").DataTypes;
var _cistella = require("./cistella");
var _producte = require("./producte");
var _productevenut = require("./productevenut");

function initModels(sequelize) {
  var cistella = _cistella(sequelize, DataTypes);
  var producte = _producte(sequelize, DataTypes);
  var productevenut = _productevenut(sequelize, DataTypes);


  return {
    cistella,
    producte,
    productevenut,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
