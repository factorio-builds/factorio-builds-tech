const dotenv = require("dotenv")

dotenv.config()

module.exports = {
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: process.env.TYPEORM_PORT,
  synchronize: process.env.TYPEORM_SYNCHRONIE,
  logging: process.env.TYPEORM_LOGGING,
  entities: [process.env.TYPEORM_ENTITIES],
  migrations: [process.env.TYPEORM_MIGRATIONS],
  seeds: [process.env.TYPEORM_SEEDING_SEEDS],
}
