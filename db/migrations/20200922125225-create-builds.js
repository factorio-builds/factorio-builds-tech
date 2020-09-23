"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("builds", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      ownerId: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
        field: "owner_id",
      },
      name: {
        type: Sequelize.STRING,
      },
      blueprint: {
        type: Sequelize.TEXT,
      },
      blueprintJson: {
        type: Sequelize.JSONB,
        field: "json",
      },
      metadata: {
        type: Sequelize.JSONB,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at",
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "updated_at",
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("builds")
  },
}
