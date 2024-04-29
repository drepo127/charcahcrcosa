const { Sequelize } = require('sequelize');

const crearConfigBaseDades = () => {
  return new Sequelize("charcacharcosa", "root", "root", {
    host: 'localhost',
    port: 3306,
    dialect: "mysql",
    define: {
      timestamps: false,
      freezeTableName: true
    },
  });
};

module.exports = { crearConfigBaseDades };

