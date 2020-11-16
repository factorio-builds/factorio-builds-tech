import S3 from "aws-sdk/clients/s3"
import { promises as fs } from "fs"
import { FileHandleException } from "../exceptions/file.exceptions"

export async function uploadFile(
  name: string,
  filePath: string
): Promise<S3.ManagedUpload.SendData> {
  if (!process.env.AWS_S3_BUCKET || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw "AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY ENVIRONMENT VARIABLES MUST BE DEFINED"
  }

  const s3 = new S3({
    apiVersion: "2006-03-01",
    region: "us-west-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  })

  // ideally we want to avoid saving file to disk
  const file = await fs.readFile(filePath).catch(() => {
    throw new FileHandleException("Can't find file")
  })

  if (!file) {
    throw new FileHandleException("Can't find file")
  }

  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: process.env.AWS_S3_BUCKET as string,
        Key: name,
        Body: file,
        ACL: "public-read",
      },
      (err, data) => {
        if (err) {
          reject(err)
        }

        resolve(data)
      }
    )
  })
}
