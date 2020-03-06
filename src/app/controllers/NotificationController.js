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
      user: req.userId,
      read: false
    }).sort({ createdAt: 'desc' }).limit(20)

    if (notifications.length === 0) {
      return res.status(200).json({ message: 'There is no notifications for today' })
    }

    return res.json({ message: 'Showing all notifications', data: notifications })
  }

  async update (req, res) {
    const { id } = req.params

    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true })

    return res.json({
      message: 'Notification readed successfuly',
      data: notification
    })
  }
}

export default new NotificationController()
