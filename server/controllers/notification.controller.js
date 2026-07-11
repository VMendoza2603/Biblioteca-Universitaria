const Notification = require('../models/Notification');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate('loan', 'book status loanDate returnDate')
      .sort({ createdAt: -1 })
      .limit(50);
    const unread = await Notification.countDocuments({ user: req.user._id, read: false });
    res.json({ notifications, unread });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: 'Notificaciones marcadas como leídas' });
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar notificaciones' });
  }
};

const createNotification = async (req, res) => {
  try {
    const { userId, loanId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ message: 'userId y message son obligatorios' });
    }
    const notification = await Notification.create({
      user: userId,
      loan: loanId || undefined,
      message,
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear notificación' });
  }
};

module.exports = { getMyNotifications, markAsRead, createNotification };
