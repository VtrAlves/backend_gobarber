import { unlink } from 'fs'
import { resolve } from 'path'

import File from '../models/File'

class FileController {
  async store (req, res) {
    const { originalname: name, filename: path } = req.file

    try {
      const file = await File.create({ name, path })

      res.status(200).json({
        message: 'File Uploaded Successfuly!',
        file
      })
    } catch (e) {
      const filePath = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', path)
      unlink(filePath, error => {
        if (error) {
          return res.status(500).json({
            message: 'Error on delete file',
            data: {
              path: filePath,
              file: req.file
            }
          })
        }
      })

      return res.status(500).json({
        message: 'Error on Insert database',
        data: req.file,
        error: e
      })
    }
  }
}

export default new FileController()
