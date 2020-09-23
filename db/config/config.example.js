"use strict"

module.exports = {
  development: {
    username: "factorio",
    password: null,
    database: "factorio_builds_dev",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: "factorio",
    password: null,
    database: "factorio_builds_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: "root",
    password: null,
    database: "factorio_builds_prod",
    host: "127.0.0.1",
    dialect: "postgres",
  },
}
