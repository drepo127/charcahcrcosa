var DataTypes = require("sequelize").DataTypes;
var _cistella = require("./cistella");
var _producte = require("./producte");
var _productevenut = require("./productevenut");

function initModels(sequelize) {
  var cistella = _cistella(sequelize, DataTypes);
  var producte = _producte(sequelize, DataTypes);
  var productevenut = _productevenut(sequelize, DataTypes);

  productevenut.belongsTo(producte, { as: "idproducte_productevenut_producte", foreignKey: "idproducte_productevenut"});
  producte.hasMany(productevenut, { as: "productevenuts", foreignKey: "idproducte_productevenut"});

  return {
    cistella,
    producte,
    productevenut,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
