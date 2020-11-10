import { ManagedUpload } from "aws-sdk/clients/s3"
import { Fields, Files, File } from "formidable"
import imageSize from "image-size"
import { ISizeCalculationResult } from "image-size/dist/types/interface"
import { promisify } from "util"
import { v4 as uuidv4 } from "uuid"
import { ensureConnection } from "../../db"
import { Build } from "../../db/entities/build.entity"
import { User } from "../../db/entities/user.entity"
import { EState } from "../../types"
import { uploadFile } from "../../utils/upload"
const imageSizeAsync = promisify(imageSize)

interface ICreateParameters {
  ownerId: string
  fields: Fields
  files: Files
}

interface IUpdateParameters {
  fields: Fields
  files: Files
}

async function handleFile(
  id: string,
  file: File
): Promise<{
  uploadedFile: ManagedUpload.SendData
  dimensions: ISizeCalculationResult
}> {
  const uploadedFile = await uploadFile(id, file.path).catch(console.error)
  const dimensions = await imageSizeAsync(file.path)

  if (!uploadedFile || !dimensions) {
    throw new Error("Failed to handle uploaded file")
  }

  return {
    uploadedFile,
    dimensions,
  }
}

async function getUserById(id: string): Promise<User | void> {
  const connection = await ensureConnection()
  const userRepository = connection!.getRepository(User)

  return userRepository.findOne(id).catch((error) => {
    console.error(error)
    throw new Error("Cannot find user data")
  })
}

async function getBuildById(id: string): Promise<Build | void> {
  const connection = await ensureConnection()
  const buildRepository = connection!.getRepository(Build)

  return buildRepository.findOne(id).catch((error) => {
    console.error(error)
    throw new Error("Cannot find build data")
  })
}

async function saveBuild(build: Build) {
  const connection = await ensureConnection()
  const buildRepository = connection!.getRepository(Build)
  const toSave = buildRepository.create(build)

  return buildRepository.save(toSave)
}

export async function createBuildUseCase({
  ownerId,
  fields,
  files,
}: ICreateParameters): Promise<Build> {
  const buildId = uuidv4()
  const { uploadedFile, dimensions } = await handleFile(buildId, files.image)
  const owner = await getUserById(ownerId)

  return saveBuild({
    id: buildId,
    name: fields.name as string,
    blueprint: fields.blueprint as string,
    description: fields.description as string,
    // @ts-ignore
    json: {},
    image: {
      src: uploadedFile.Location,
      width: dimensions.width || 0,
      height: dimensions.height || 0,
    },
    metadata: {
      state: fields.state as EState,
      // @ts-ignore
      categories: JSON.parse(fields.categories).length
        ? JSON.parse(fields.categories as string)
        : [],
      tileable: Boolean(fields.tileable as string),
      area: 0,
    },
    owner: owner as User,
  })
}

// TODO: validate ownership
export async function updateBuildUseCase({
  fields,
  files,
}: IUpdateParameters): Promise<Build> {
  const build = await getBuildById(fields.id as string)

  if (!build) {
    throw new Error("no build")
  }

  const { uploadedFile, dimensions } = await handleFile(build.id, files.image)

  build.name = fields.name as string
  build.blueprint = fields.blueprint as string
  build.description = fields.description as string
  build.metadata = {
    ...build.metadata,
    state: fields.state as EState,
    // @ts-ignore
    categories: JSON.parse(fields.categories).length
      ? JSON.parse(fields.categories as string)
      : [],
    tileable: Boolean(fields.tileable as string),
  }
  if (uploadedFile && dimensions) {
    build.image = {
      src: uploadedFile.Location,
      width: dimensions.width as number,
      height: dimensions.height as number,
    }
  }

  return saveBuild(build)
}
