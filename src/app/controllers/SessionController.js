import jwt from 'jsonwebtoken'
import * as Yup from 'yup'

import User from '../models/User'
import authConfig from '../../config/auth'

class SessionController {
  async store (req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails' })
    }

    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({ message: `User ${email} not found` })
    }

    if (!(await user.chkPassword(password))) {
      return res.status(401).json({ message: 'Passwords does not match' })
    }

    const { id, name } = user

    res.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    })

    // Go barber - md5 do jwt
  }
}

export default new SessionController()
