const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('producte', {
    id_producto: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_producto: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    descripcion_producto: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_producto: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    cantidad_descuento: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    imagen_producto: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tipo_producto: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'producte',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_producto" },
        ]
      },
    ]
  });
};
