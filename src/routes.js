import { Router } from 'express'
import multer from 'multer'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

import authmiddleware from './app/middlewares/auth'
import multerConfig from './config/multer'

const routes = new Router()

const uploads = multer(multerConfig)

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authmiddleware)

routes.put('/users/', UserController.update)

routes.post('/files', uploads.single('file'), (req, res) => {
  res.json({ message: req.file })
})

export default routes
