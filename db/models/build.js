"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class build extends Model {
    static associate(models) {
      this.belongsTo(models.user, {
        onDelete: "SET NULL",
        as: "owner",
      })
    }
  }
  build.init(
    {
      name: DataTypes.STRING,
      blueprint: DataTypes.TEXT,
      json: DataTypes.JSONB,
      metadata: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: "build",
      underscored: true,
    }
  )

  return build
}
