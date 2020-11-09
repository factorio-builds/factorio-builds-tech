import { Connection, getConnectionManager, getConnectionOptions } from "typeorm"
import { Build } from "./entities/build.entity"
import { User } from "./entities/user.entity"

// taken from https://github.com/typeorm/typeorm/issues/6241#issuecomment-643690383
const getOptions = async () => {
  const connectionOptions = await getConnectionOptions("default")

  return {
    default: {
      ...connectionOptions,
      name: "default",
      synchronize: process.env.NODE_ENV !== "production",
      entities: [Build, User],
    },
  }
}

function entitiesChanged(prevEntities: any[], newEntities: any[]): boolean {
  if (prevEntities.length !== newEntities.length) return true

  for (let i = 0; i < prevEntities.length; i++) {
    if (prevEntities[i] !== newEntities[i]) return true
  }

  return false
}

async function updateConnectionEntities(
  connection: Connection,
  entities: any[]
) {
  // @ts-ignore
  if (!entitiesChanged(connection.options.entities, entities)) return

  // @ts-ignore
  connection.options.entities = entities

  // @ts-ignore
  connection.buildMetadatas()

  if (connection.options.synchronize) {
    await connection.synchronize()
  }
}

export async function ensureConnection(name = "default"): Promise<Connection> {
  const connectionManager = getConnectionManager()
  const options = await getOptions()

  if (connectionManager.has(name)) {
    const connection = connectionManager.get(name)

    if (!connection.isConnected) {
      await connection.connect()
    }

    if (process.env.NODE_ENV !== "production") {
      // @ts-ignore
      await updateConnectionEntities(connection, options[name].entities)
    }

    return connection
  }

  // @ts-ignore
  return connectionManager.create({ name, ...options[name] }).connect()
}
