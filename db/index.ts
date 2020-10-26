import {
  Connection,
  createConnection,
  getConnectionManager,
  getConnectionOptions,
} from "typeorm"
import { Build } from "./entities/build.entity"
import { User } from "./entities/user.entity"

// taken from https://github.com/vercel/next.js/discussions/12254#discussioncomment-19769
// TODO: get from environment vars or something
const ENVIRONMENT = "default"
const CONNECTION_ATTEMPT_INTERVAL = 100
const CONNECTION_TIMEOUT = 3 //3 seconds

// initialize database connection
let isConnecting = false
let connection: Connection
const initializeDatabase = async () => {
  if (isConnecting) return
  isConnecting = true

  // close connection if exists. could contain references to unloaded entities.
  const connections = getConnectionManager()
  if (connections.has(ENVIRONMENT)) {
    await connections.get(ENVIRONMENT).close()
  }

  // create new connection
  const newConnection = await createConnection({
    ...(await getConnectionOptions(ENVIRONMENT)),
    name: ENVIRONMENT,
    entities: [Build, User],
    synchronize: true,
  })

  connection = newConnection
  isConnecting = false

  // log for debugging
  console.log(`Connection to database "${ENVIRONMENT}" initialized.`)
}

// run initialization on script execution.
// for prod this will only happen once, but for dev this will happen every time this module is hot reloaded
initializeDatabase()

// wait for the connection to the database has been established
export const connectDB = async () => {
  let waiting = 0
  while (!connection) {
    await new Promise((resolve) =>
      setTimeout(resolve, CONNECTION_ATTEMPT_INTERVAL)
    )
    waiting += CONNECTION_ATTEMPT_INTERVAL
    if (waiting > CONNECTION_TIMEOUT) break
  }
  if (!connection) throw new Error("Database not intialized")
  return connection
}
