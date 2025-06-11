const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    submitAnswer,
    getQuestionsBySubject,
    getQuestionsByTopic,
    getQuestionsByYear,
    getRandomQuestions
} = require('../controllers/questionController');

// Public routes
router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.get('/subject/:subjectId', getQuestionsBySubject);
router.get('/topic/:topicId', getQuestionsByTopic);
// Handle both /year/2023 and /year/2023/06 patterns
router.get('/year/:year', getQuestionsByYear);
router.get('/year/:year/:month', getQuestionsByYear);

// Protected routes
router.post('/:id/answer', protect, submitAnswer);
router.get('/practice/random', protect, getRandomQuestions);

// Admin routes
router.post('/', protect, admin, createQuestion);
router.put('/:id', protect, admin, updateQuestion);
router.delete('/:id', protect, admin, deleteQuestion);

module.exports = router;
