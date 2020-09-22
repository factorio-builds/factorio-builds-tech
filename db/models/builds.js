"use strict"
const { Model } = require("sequelize")
const { users } = require("./users")

module.exports = (sequelize, DataTypes) => {
  class builds extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      console.dir(models)
    }
  }
  builds.init(
    {
      name: DataTypes.STRING,
      ownerId: DataTypes.UUID,
      blueprint: DataTypes.TEXT,
      blueprintJson: DataTypes.JSONB,
      metadata: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: "builds",
    }
  )

  builds.belongsTo(users)
  return builds
}
