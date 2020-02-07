import * as Yup from 'yup'

import User from '../models/User'

class UserController {
  async store (req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(4)
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails' })
    }

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

  async update (req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldpassword: Yup.string().min(4),
      password: Yup.string()
        .min(4)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails' })
    }

    const { email, oldPassword } = req.body

    const user = await User.findByPk(req.userId)

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } })

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' })
      }
    }

    if (oldPassword && !(await user.chkPassword(oldPassword))) {
      return res.status(401).json({ message: 'Password incorrect' })
    }

    const { id, name, provider } = await user.update(req.body)

    res.json({
      message: 'User updated succesfuly',
      data: { id, name, email, provider }
    })
  }
}

export default new UserController()
