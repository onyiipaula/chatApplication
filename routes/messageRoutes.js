const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const mongoose = require('mongoose');

// POST route to create a new message
router.post('/', async (req, res) => {
    try {
        console.log('Received data:', req.body); // Log the request body

        const { sender, receiver, content } = req.body;

        // Validate that all required fields are present
        if (!sender || !receiver || !content) {
            return res.status(400).json({ message: 'Sender, receiver, and content are required.' });
        }

        // Check if sender and receiver are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
            return res.status(400).json({ message: 'Invalid sender or receiver ID.' });
        }

        // Create and save the new message
        const message = new Message({ sender, receiver, content });
        await message.save();
        
        res.status(201).json(message);
    } catch (error) {
        console.error('Error saving message:', error); // Log the exact error
        res.status(500).json({ message: 'Error sending message' });
    }
});

// GET route to fetch all messages
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 }); // Use timestamp for sorting
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error); // Log the error
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

module.exports = router;
