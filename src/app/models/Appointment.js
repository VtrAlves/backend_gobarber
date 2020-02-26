import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs'

class Appointment extends Model {
  static init (sequelize) {
    super.init(
      {
        date: Sequelize.DATE
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
