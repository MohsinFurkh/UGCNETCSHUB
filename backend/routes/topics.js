const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
    getTopics,
    getTopicById,
    createTopic,
    updateTopic,
    deleteTopic,
    getTopicStats,
    searchTopics
} = require('../controllers/topicController');

// Public routes
router.get('/', getTopics);
router.get('/search', searchTopics);
router.get('/:id', getTopicById);

// Protected routes
router.get('/:id/stats', protect, getTopicStats);

// Admin routes
router.post('/', protect, admin, createTopic);
router.put('/:id', protect, admin, updateTopic);
router.delete('/:id', protect, admin, deleteTopic);

module.exports = router;
