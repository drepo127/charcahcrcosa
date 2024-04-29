const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productevenut', {
    idproductevenut: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idproducte_productevenut: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nom_producte_venut: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    cantitat_producte_venut: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    preuTotal_producte_venut: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    data_producte_venut: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    cantitat_descompte: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    usuari_compradors: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'productevenut',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idproductevenut" },
        ]
      },
    ]
  });
};
