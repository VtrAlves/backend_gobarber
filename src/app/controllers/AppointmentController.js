import * as Yup from 'yup'

import User from '../models/User'
import Appointment from '../models/Appointment'

class SessionController {
  async store (req, res) {
    const schema = Yup.object().shape({
      providerId: Yup.number().required(),
      date: Yup.date().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails.' })
    }

    const { providerId, date } = req.body

    const providerIsValid = await User.findOne({
      where: {
        id: providerId, provider: true
      }
    })

    if (!providerIsValid) {
      return res.status(401).json({ message: 'Provider is not valid.' })
    }

    const newAppointment = await Appointment.create({
      userId: req.userId,
      date,
      providerId
    })

    res.status(200).json({
      message: 'Appointment created successfuly',
      data: newAppointment
    })
  }
}

export default new SessionController()
