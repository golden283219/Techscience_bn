import { createWriteStream, unlinkSync, existsSync } from "fs";
import { join } from "path";
import cryptoRandomString from "crypto-random-string";



const uploadDir = join(__dirname, '../../public/upload/images')
const questionDir = join(uploadDir, 'questions')
const shapeDir = join(uploadDir, 'shapes')
const accountDir = join(uploadDir, 'logos')

export const fileUploader = async ({ file, oldFile, type }) => {
  if (!file)
    return { url: null }

  const { createReadStream, filename, mimetype } = await file

  if (mimetype.indexOf('image') < 0)
    return { error: 'Error! You must provide only image file' }

  if (!!oldFile)
    fileRemover(oldFile)

  const { fileName, writePath } = getWritePath({ filename, type })
  const writeStream = createWriteStream(writePath)
  createReadStream().pipe(writeStream)
  return { url: fileName }
}

export const fileRemover = ({ filePath, type }) => {
  if (!filePath)
    return

  const realPath = getRemovePath({ filePath, type })

  try {
    if (!existsSync(realPath))
      return

    return unlinkSync(realPath)
  } catch (error) {
    console.log('file remove err', error)
    return
  }
}

const fileNameGenrator = filename => {
  const extension = filename.split('.').pop()
  const randomString = cryptoRandomString({ length: 20 })
  return `${randomString}.${extension}`
}

const getWritePath = ({ filename, type }) => {
  const fileName = fileNameGenrator(filename)
  let writePath = ''

  switch (type) {
    case 'question':
      writePath = join(questionDir, fileName)
      break;

    case 'shape':
      writePath = join(shapeDir, fileName)
      break;

    case 'account':
      writePath = join(accountDir, fileName)
      break;

    default:
      writePath = join(questionDir, fileName)
      break;
  }

  return { fileName, writePath }
}

const getRemovePath = ({ filePath, type }) => {
  switch (type) {
    case 'question':
      return join(questionDir, filePath)

    case 'shape':
      return join(shapeDir, filePath)

    default:
      return join(questionDir, filePath)
  }
}