import * as AWS from 'aws-sdk'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as yaml from 'yaml'
import config from "../src/config.json"
const s3 = new AWS.S3({
    accessKeyId: config.S3_ACCESS_KEY_ID,
    secretAccessKey: config.S3_SECRET_KEY,
    endpoint: config.S3_ENDPOINT,
    region: config.S3_REGION,
    s3ForcePathStyle: true,
})

const directoryPath = './release'
const filePath = './release/latest.yml'

fs.readFile(filePath, 'utf8')
    .then(data => {
        const latestYml = yaml.parse(data)

        // Добавляем пользовательские значения
        latestYml.updateUrgency = 'soft'
        latestYml.commonConfig = {
            DEPRECATED_VERSIONS: '<=1.0.0',
            UPDATE_URL: `${config.UPDATE_URL}/dev_build/`,
        }

        const newYaml = yaml.stringify(latestYml)

        return fs.writeFile(filePath, newYaml, 'utf8')
    })
    .then(() => {
        console.log('latest.yml updated successfully!')
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.log('Error reading the directory:', err)
                return
            }

            const filesToUpload = files.filter(
                file =>
                    file === 'latest.yml' ||
                    (file.startsWith('PulseSync Setup') &&
                        (file.endsWith('.exe') ||
                            file.endsWith('.exe.blockmap'))),
            )

            filesToUpload.forEach(uploadFile)
        })
    })
    .catch(err => {
        console.error('Error updating latest.yml:', err)
    })

// Функция для загрузки файла в S3
const uploadFile = (fileName: string) => {
    const filePath = path.join(directoryPath, fileName)
    const fileContent = fs.readFileSync(filePath)

    const params = {
        Bucket: config.S3_BUCKET, // замените на имя вашего S3 bucket
        Key: `dev_build/${fileName}`, // добавляем префикс dev_build
        Body: fileContent,
    }

    s3.upload(
        params,
        (err: AWS.AWSError, data: AWS.S3.ManagedUpload.SendData) => {
            if (err) {
                console.log(`Error uploading file ${fileName}:`, err)
            } else {
                console.log(`File ${fileName} upload to S3:`, data.Location)
            }
        },
    )
}
