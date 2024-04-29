const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cistella', {
    idcistella: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    usuari_afegit: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    nom_producte: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    cantitat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    preu_unitat: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    imagen_producto: {
      type: DataTypes.BLOB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cistella',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idcistella" },
        ]
      },
    ]
  });
};
