import * as Yup from 'yup'
import { startOfHour, parseISO, isBefore } from 'date-fns'

import User from '../models/User'
import Appointment from '../models/Appointment'

class SessionController {
  async store (req, res) {
    const schema = Yup.object().shape({
      providerId: Yup.number().required(),
      date: Yup.date().required()
    })

    // Valida se os itens obrigatórios existem.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails.' })
    }

    const { providerId, date } = req.body

    const providerIsValid = await User.findOne({
      where: {
        id: providerId, provider: true
      }
    })

    // Verifica se o usuário enviado é um provider.
    if (!providerIsValid) {
      return res.status(401).json({ message: 'Provider is not valid.' })
    }

    const hourProvided = startOfHour(parseISO(date))

    // Verifica se a hora é anterior a atual.
    if (isBefore(hourProvided, new Date())) {
      return res.status(400).json({ message: 'Hour already passed' })
    }

    const checkAvaliability = Appointment.findOne({
      where: {
        date: hourProvided,
        canceled
      }
    })

    // Verifica se o Horário está ocupado.
    if (checkAvaliability) {

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
