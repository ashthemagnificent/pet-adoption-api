const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');


// Example route for testing
router.get('/', (req, res) => {
  res.send('Messages route is working!');
});

module.exports = router; // Export the router

// Send a Message
router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    if (!senderId || !receiverId || !content)
      return res.status(400).json({ error: 'Sender, receiver, and content are required' });

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) return res.status(404).json({ error: 'Sender or receiver not found' });

    const message = new Message({ sender: senderId, receiver: receiverId, content });
    await message.save();

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Error sending message', details: err.message });
  }
});

// Retrieve Messages for a Specific User
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate('sender receiver', 'name email');

    if (!messages.length) return res.status(404).json({ error: 'No messages found' });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages', details: err.message });
  }
});

// Get Message Thread Between Two Users
router.get('/:userId/thread/:otherUserId', async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ timestamp: 1 }).populate('sender receiver', 'name email');

    if (!messages.length) return res.status(404).json({ error: 'No messages found between users' });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching message thread', details: err.message });
  }
});

module.exports = router;