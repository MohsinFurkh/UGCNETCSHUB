const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
    getTopicsBySubject,
    getSubjectStats
} = require('../controllers/subjectController');

// Public routes
router.get('/', getSubjects);
router.get('/:id', getSubjectById);
router.get('/:id/topics', getTopicsBySubject);

// Protected routes
router.get('/:id/stats', protect, getSubjectStats);

// Admin routes
router.post('/', protect, admin, createSubject);
router.put('/:id', protect, admin, updateSubject);
router.delete('/:id', protect, admin, deleteSubject);

module.exports = router;
