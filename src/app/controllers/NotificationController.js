import User from '../models/User'
import Notification from '../schema/Notification'

class NotificationController {
  async index (req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    })

    if (!checkIsProvider) {
      res.status(401).json({ message: 'Only a provider can load notifications' })
    }

    const notifications = await Notification.find({
      user: req.userId
    }).sort({ createdAt: 'desc' }).limit(20)

    return res.json({ message: 'Showing all notifications', data: notifications })
  }

  async update (req, res) {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true })

    return res.json({
      message: 'Notification readed successfuly',
      data: notification
    })
  }
}

export default new NotificationController()
