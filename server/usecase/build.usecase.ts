import { ManagedUpload } from "aws-sdk/clients/s3"
import { Fields, Files, File } from "formidable"
import imageSize from "image-size"
import { ISizeCalculationResult } from "image-size/dist/types/interface"
import { promisify } from "util"
import { v4 as uuidv4 } from "uuid"
import { Build } from "../../db/entities/build.entity"
import { User } from "../../db/entities/user.entity"
import { BuildRepository } from "../../db/repository/build.repository"
import { UserRepository } from "../../db/repository/user.repository"
import { EState } from "../../types"
import { uploadFile } from "../../utils/upload"
const imageSizeAsync = promisify(imageSize)

interface ICreateParameters {
  ownerId: string
  fields: Fields
  files: Files
}

interface IUpdateParameters {
  buildId: string
  ownerId: string
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
  const userRepository = await UserRepository()

  return userRepository.findOne(id).catch((error) => {
    console.error(error)
    throw new Error("Cannot find user data")
  })
}

async function getBuildById(id: string): Promise<Build | void> {
  const buildRepository = await BuildRepository()

  return buildRepository.findOne(id).catch((error) => {
    console.error(error)
    throw new Error("Cannot find build data")
  })
}

async function isOwnedByUser(
  buildId: string,
  ownerId: string
): Promise<boolean> {
  const buildRepository = await BuildRepository()

  return buildRepository.isOwnedBy(buildId, ownerId)
}

async function saveBuild(build: Build) {
  const buildRepository = await BuildRepository()
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
  buildId,
  ownerId,
  fields,
  files,
}: IUpdateParameters): Promise<Build> {
  const build = await getBuildById(buildId)

  if (!build) {
    throw new Error("no build")
  }

  const ownedByUser = await isOwnedByUser(buildId, ownerId)

  if (!ownedByUser) {
    throw new Error("you do not own that build")
  }

  if (files.image) {
    const { uploadedFile, dimensions } = await handleFile(buildId, files.image)

    if (uploadedFile && dimensions) {
      build.image = {
        src: uploadedFile.Location,
        width: dimensions.width as number,
        height: dimensions.height as number,
      }
    }
  }

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

  return saveBuild(build)
}
