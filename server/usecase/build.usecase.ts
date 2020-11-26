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
import {
  EntityNotFoundException,
  EntityPermissonException,
} from "../exceptions/entity.exceptions"
import { FileHandleException } from "../exceptions/file.exceptions"
import { uploadFile } from "../services/upload.service"
import { ViewCountService } from "../services/view-count.service"
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

interface IIncrementViewParameters {
  build: Build
  ip: string
}

interface IUploadedFile {
  uploadedFile: ManagedUpload.SendData
  dimensions: ISizeCalculationResult
}

async function handleFile(id: string, file: File): Promise<IUploadedFile> {
  const uploadedFile = await uploadFile(id, file.path).catch(console.error)
  const dimensions = await imageSizeAsync(file.path)

  if (!uploadedFile || !dimensions) {
    throw new FileHandleException("Failed to handle uploaded file")
  }

  return {
    uploadedFile,
    dimensions,
  }
}

async function getUserById(id: string): Promise<User | void> {
  const userRepository = await UserRepository()

  return userRepository.findOne(id).catch(() => {
    throw new EntityNotFoundException("User not found")
  })
}

async function getBuildById(id: string): Promise<Build | void> {
  const buildRepository = await BuildRepository()

  return buildRepository.findOne(id).catch(() => {
    throw new EntityNotFoundException("Build not found")
  })
}

async function userIsAdmin(userId: string): Promise<boolean> {
  const userRepository = await UserRepository()

  return userRepository.isAdmin(userId)
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

async function buildMapper({
  buildId,
  fields,
  image,
  owner,
}: {
  buildId: string
  fields: Fields
  image: IUploadedFile | void
  owner?: User
}): Promise<Build> {
  const build: Build = {
    id: buildId,
    name: fields.name as string,
    blueprint: fields.blueprint as string,
    description: fields.description as string,
    // @ts-ignore
    json: {},
    metadata: {
      state: fields.state as EState,
      // @ts-ignore
      categories: JSON.parse(fields.categories).length
        ? JSON.parse(fields.categories as string)
        : [],
      markedInputs: Boolean(fields.markedInputs as string),
      tileable: Boolean(fields.tileable as string),
      area: 0,
    },
  }

  if (owner) {
    build.owner = owner
  }

  if (image) {
    build.image = {
      src: image.uploadedFile.Location,
      width: image.dimensions.width as number,
      height: image.dimensions.height as number,
    }
  }

  return build
}

export async function createBuildUseCase({
  ownerId,
  fields,
  files,
}: ICreateParameters): Promise<Build> {
  const buildId = uuidv4()
  const owner = await getUserById(ownerId)

  if (!owner) {
    throw new EntityNotFoundException("User not found")
  }

  let image: IUploadedFile | void

  if (files.image) {
    image = await handleFile(buildId, files.image)
  }

  const build = await buildMapper({ buildId, fields, image, owner })

  return saveBuild(build)
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
    throw new EntityNotFoundException("Build not found")
  }

  const [isAdmin, ownedByUser] = await Promise.all([
    userIsAdmin(ownerId),
    isOwnedByUser(buildId, ownerId),
  ])

  if (!ownedByUser && !isAdmin) {
    throw new EntityPermissonException("You do not own that build")
  }

  let image: IUploadedFile | void

  if (files.image) {
    image = await handleFile(buildId, files.image)
  }

  const updatedBuild = await buildMapper({ buildId, fields, image })

  return saveBuild(updatedBuild)
}

export async function viewBuildIncrementUseCase({
  build,
  ip,
}: IIncrementViewParameters): Promise<boolean> {
  const viewCountService = new ViewCountService()
  const inCooldown = await viewCountService.cooldown(build.id, ip)

  if (!inCooldown) {
    const buildRepository = await BuildRepository()
    const incremented = await buildRepository.incrementViews(build)
    return incremented
  }

  return false
}
