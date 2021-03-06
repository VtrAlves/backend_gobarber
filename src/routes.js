import { Router } from 'express'
import multer from 'multer'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import FileController from './app/controllers/FileController'
import ProviderController from './app/controllers/ProviderController'
import AppointmentController from './app/controllers/AppointmentController'
import ScheduleController from './app/controllers/ScheduleController'
import NotificationController from './app/controllers/NotificationController'
import AvailableController from './app/controllers/AvailableController'

import authmiddleware from './app/middlewares/auth'
import multerConfig from './config/multer'

const routes = new Router()

const uploads = multer(multerConfig)

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authmiddleware)

routes.get('/providers', ProviderController.index)
routes.get('/providers/:providerId/available', AvailableController.index)
routes.get('/appointments', AppointmentController.index)
routes.get('/schedules', ScheduleController.index)
routes.get('/notifications', NotificationController.index)

routes.post('/appointments', AppointmentController.store)
routes.post('/files', uploads.single('file'), FileController.store)

routes.put('/users/:id', UserController.update)
routes.put('/notifications/:id', NotificationController.update)

routes.delete('/appointments/:id', AppointmentController.delete)

export default routes
