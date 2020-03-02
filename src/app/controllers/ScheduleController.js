import { startOfDay, endOfDay, parseISO } from 'date-fns'
import { Op } from 'sequelize'

import Appointment from '../models/Appointment'
import User from '../models/User'

class ScheduleController {
  async index (req, res) {
    const checkUserIsProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true
      }
    })

    if (!checkUserIsProvider) {
      return res.status(401).json({ message: 'User is not a provider' })
    }

    const { date } = req.query

    const recievedDate = parseISO(date)

    const appointments = await Appointment.findAll({
      where: {
        providerId: req.userId,
        canceledAt: null,
        date: {
          [Op.between]: [startOfDay(recievedDate), endOfDay(recievedDate)]
        }
      }
    })

    if (appointments.length === 0) {
      return res.status(400).json({ message: 'There is no appointments for today' })
    }

    return res.status(200).json({ message: 'Showing All Apointments for today', data: appointments })
  }
}

export default new ScheduleController()
