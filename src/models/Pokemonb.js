const { INTEGER } = require('sequelize');
const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemonb', {
    id:{
      // type:DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,
      type:INTEGER,
      primaryKey:true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hp: {
      type: DataTypes.STRING,
    },
    defense: {
      type: DataTypes.STRING,
    },
    attack: {
      type: DataTypes.STRING,
    },
    speed: {
      type: DataTypes.STRING,
    },
    height: {
      type: DataTypes.STRING,
    },
    weight: {
      type: DataTypes.STRING,
    },
    sprite: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shiny: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    types: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },

  },
  {
   timestamp: false, 
  });
};
