import * as Yup from 'yup'
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns'
import { pt } from 'date-fns/locale'

import User from '../models/User'
import Appointment from '../models/Appointment'
import File from '../models/File'
import Notification from '../schema/Notification'

class AppointmentController {
  async index (req, res) {
    const { page = 1 } = req.query

    const appointments = await Appointment.findAll({
      where: { userId: req.userId, canceledAt: null },
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date'],
      include: {
        model: User,
        as: 'provider',
        attributes: ['id', 'name'],
        include: {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }
      }
    })

    if (appointments.length === 0) {
      return res.status(400).json({ message: 'Appointment not found or page isn\'t exists' })
    }

    return res.json({ message: 'Showing all appointments', data: appointments })
  }

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

    // Verifica se o user é o mesmo que o provider.
    if (req.userId === providerId) {
      return res.status(401).json({ message: 'Provider can not create a appointment to himself' })
    }

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

    const checkAvaliability = await Appointment.findOne({
      where: {
        date: hourProvided,
        canceledAt: null,
        providerId
      }
    })

    // Verifica se o Horário está ocupado.
    if (checkAvaliability) {
      return res.status(400).json({ message: 'This appointment isn\'t avaliable for this request' })
    }

    const newAppointment = await Appointment.create({
      userId: req.userId,
      date: hourProvided,
      providerId
    })

    const user = await User.findByPk(req.userId)

    const formattedDate = format(hourProvided, "'dia' dd 'de' MMMM', ás' H:mm'h'", { locale: pt })

    // informa a criação do apontamento
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: providerId
    })

    res.status(201).json({
      message: 'Appointment created successfuly',
      data: newAppointment
    })
  }

  async delete (req, res) {
    const appointment = Appointment.findByPk(req.params.id)

    if (appointment.userId !== req.userId) {
      return res.send(401).json({
        message: "You don't have permission to cancel this appointment"
      })
    }

    const hourSub = subHours(appointment.date, 2)

    if (isBefore(hourSub, new Date())) {
      return res.send(401).json({
        message: 'You can only cancel appointments 2 hours in advance'
      })
    }

    appointment.canceledAt = new Date()

    await appointment.save()

    return res.status(401).json({
      message: `Appointment ${appointment.id} canceled successfuly`,
      data: appointment
    })
  }
}

export default new AppointmentController()
