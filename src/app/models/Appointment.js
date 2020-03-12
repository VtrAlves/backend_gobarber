import Sequelize, { Model } from 'sequelize'
import { isBefore, subHours } from 'date-fns'
import bcrypt from 'bcryptjs'

class Appointment extends Model {
  static init (sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceledAt: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get () {
            return isBefore(this.date, new Date())
          }
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get () {
            return isBefore(new Date(), subHours(this.date, 2))
          }
        }
      },
      {
        sequelize,
        modelName: 'appointments'
      }
    )

    return this
  }

  static associate (models) {
    this.belongsTo(models.users, { foreignKey: 'userId', as: 'user' })
    this.belongsTo(models.users, { foreignKey: 'providerId', as: 'provider' })
  }

  chkPassword (password) {
    return bcrypt.compare(password, this.passwordHash)
  }
}

export default Appointment
