import { Router } from 'express'

import User from './app/models/User'

const routes = new Router()

routes.get('/', (req, res) => {
  const newUser = User.create({
    name: 'Vitor Alves',
    email: 'vitoralves35@outlook.com',
    password_bash: '123456789987654231'
  })
  res.json(newUser)
})

export default routes
