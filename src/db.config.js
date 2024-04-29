const Sequelize = require('sequelize');

const ConfigDB = () => {
  return new Sequelize("charcacharcosa", "root", "1212",{
    host: "localhost",
    dialect: "mysql",
  })
}

module.exports = {ConfigDB}
