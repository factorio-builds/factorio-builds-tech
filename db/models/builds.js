"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class builds extends Model {
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: "owner_id",
        targetKey: "id",
        onDelete: "SET NULL",
      })
    }
  }
  builds.init(
    {
      name: DataTypes.STRING,
      ownerId: {
        field: "owner_id",
        type: DataTypes.UUID,
      },
      blueprint: DataTypes.TEXT,
      json: DataTypes.JSONB,
      metadata: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: "builds",
      underscored: true,
    }
  )

  return builds
}
