import { startOfDay, endOfDay, setHours, setMinutes, setSeconds, format } from 'date-fns'
import { Op } from 'sequelize'

import Appointment from '../models/Appointment'

class AvailableController {
  async index (req, res) {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ message: 'Invalid date' })
    }

    const searchDate = Number(date)

    const appointments = await Appointment.findAll({
      where: {
        providerId: req.params.providerId,
        canceledAt: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)]
        }
      }
    })

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00'
    ]

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':')
      const value = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0)

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'hh:mm:ssxxx")
      }
    })

    res.json({ message: 'In Development', data: appointments })
  }
}

export default new AvailableController()
