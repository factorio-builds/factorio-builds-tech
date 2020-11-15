import { redisClient } from "../redis"

const FIFTEEN_MINUTES_IN_SECONDS = 15 * 60

export class ViewCountService {
  async cooldown(buildId: string, ip: string): Promise<boolean> {
    const inCooldown = await this.inCooldown(buildId, ip)

    if (!inCooldown) {
      await this.add(buildId, ip)
    }

    return inCooldown
  }

  private async add(buildId: string, ip: string): Promise<void> {
    return new Promise((resolve, reject) => {
      redisClient.SETEX(
        `cooldown:build-${buildId}:ip-${ip}`,
        FIFTEEN_MINUTES_IN_SECONDS,
        "in-cooldown",
        (err) => {
          if (err) {
            reject(err)
          }

          resolve()
        }
      )
    })
  }

  private async inCooldown(buildId: string, ip: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      redisClient.EXISTS(`cooldown:build-${buildId}:ip-${ip}`, (err, value) => {
        if (err) {
          reject(err)
        }

        resolve(Boolean(value))
      })
    })
  }
}
