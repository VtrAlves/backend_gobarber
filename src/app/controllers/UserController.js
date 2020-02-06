import User from '../models/User'

class UserController {
  async store (req, res) {
    const emailExists = await User.findOne({ where: { email: req.body.email } })
    if (emailExists) {
      res.status(400).json({ message: 'User already exists.' })
    }

    const { id, name, email, provider } = await User.create(req.body)

    res.json({
      message: 'User created successfuly',
      data: { id, name, email, provider }
    })
  }
}

export default new UserController()
