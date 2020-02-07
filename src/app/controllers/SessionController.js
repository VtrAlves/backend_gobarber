import User from '../models/User'
import jwt from 'jsonwebtoken'

class SessionController {
  async store (req, res) {
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
      token: jwt.sign({ id }, 'bc5f50c7f0c4032490bc0cf568ccb929', {
        expiresIn: '1h'
      })
    })

    // Go barber - jwt do bootcamp
  }
}

export default new SessionController()
