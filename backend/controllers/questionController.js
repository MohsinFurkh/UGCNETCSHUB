const Question = require('../models/Question');
const asyncHandler = require('express-async-handler');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
exports.getQuestions = asyncHandler(async (req, res) => {
    const { 
        subject, 
        topic, 
        year, 
        month, 
        paper, 
        difficulty,
        limit = 10, 
        page = 1 
    } = req.query;

    const query = {};
    
    // Build query
    if (subject) query.subject = subject;
    if (topic) query.topic = topic;
    if (year) query.year = year;
    if (month) query.month = month;
    if (paper) query.paper = paper;
    if (difficulty) query.difficulty = difficulty;

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const skip = pageSize * (currentPage - 1);

    const count = await Question.countDocuments(query);
    const questions = await Question.find(query)
        .populate('subject', 'name code')
        .populate('topic', 'name code')
        .limit(pageSize)
        .skip(skip)
        .sort({ year: -1, questionNumber: 1 });

    res.json({
        questions,
        page: currentPage,
        pages: Math.ceil(count / pageSize),
        total: count
    });
});

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
exports.getQuestionById = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id)
        .populate('subject', 'name code')
        .populate('topic', 'name code')
        .populate('addedBy', 'name');

    if (question) {
        // Increment view count or track question view
        question.stats.totalAttempts += 1;
        await question.save();
        
        res.json(question);
    } else {
        res.status(404);
        throw new Error('Question not found');
    }
});

// @desc    Create a question
// @route   POST /api/questions
// @access  Private/Admin
exports.createQuestion = asyncHandler(async (req, res) => {
    const {
        questionText,
        options,
        correctOption,
        explanation,
        difficulty,
        subject,
        topic,
        year,
        month,
        paper,
        questionNumber,
        officialAnswerKey,
        officialAnswerKeyLink,
        tags
    } = req.body;

    const question = new Question({
        questionText,
        options,
        correctOption,
        explanation,
        difficulty: difficulty || 'medium',
        subject,
        topic,
        year,
        month,
        paper,
        questionNumber,
        officialAnswerKey,
        officialAnswerKeyLink,
        tags,
        addedBy: req.user._id,
        isVerified: req.user.role === 'admin' // Auto-verify if admin
    });

    const createdQuestion = await question.save();
    res.status(201).json(createdQuestion);
});

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
exports.updateQuestion = asyncHandler(async (req, res) => {
    const {
        questionText,
        options,
        correctOption,
        explanation,
        difficulty,
        subject,
        topic,
        year,
        month,
        paper,
        questionNumber,
        officialAnswerKey,
        officialAnswerKeyLink,
        tags,
        isVerified
    } = req.body;

    const question = await Question.findById(req.params.id);

    if (question) {
        question.questionText = questionText || question.questionText;
        question.options = options || question.options;
        question.correctOption = correctOption !== undefined ? correctOption : question.correctOption;
        question.explanation = explanation !== undefined ? explanation : question.explanation;
        question.difficulty = difficulty || question.difficulty;
        question.subject = subject || question.subject;
        question.topic = topic || question.topic;
        question.year = year || question.year;
        question.month = month || question.month;
        question.paper = paper || question.paper;
        question.questionNumber = questionNumber || question.questionNumber;
        question.officialAnswerKey = officialAnswerKey !== undefined ? officialAnswerKey : question.officialAnswerKey;
        question.officialAnswerKeyLink = officialAnswerKeyLink !== undefined ? officialAnswerKeyLink : question.officialAnswerKeyLink;
        question.tags = tags || question.tags;
        
        // Only allow admins to update verification status
        if (isVerified !== undefined && req.user.role === 'admin') {
            question.isVerified = isVerified;
        }

        const updatedQuestion = await question.save();
        res.json(updatedQuestion);
    } else {
        res.status(404);
        throw new Error('Question not found');
    }
});

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
exports.deleteQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);

    if (question) {
        await question.remove();
        res.json({ message: 'Question removed' });
    } else {
        res.status(404);
        throw new Error('Question not found');
    }
});

// @desc    Submit answer and get result
// @route   POST /api/questions/:id/answer
// @access  Private
exports.submitAnswer = asyncHandler(async (req, res) => {
    const { answer } = req.body;
    
    const question = await Question.findById(req.params.id);

    if (!question) {
        res.status(404);
        throw new Error('Question not found');
    }

    // Update question stats
    question.stats.totalAttempts += 1;
    
    const isCorrect = question.correctOption === answer;
    if (isCorrect) {
        question.stats.correctAttempts += 1;
    }
    
    question.stats.accuracy = (question.stats.correctAttempts / question.stats.totalAttempts) * 100;
    
    await question.save();

    // Return result without revealing the correct answer if wrong
    const response = {
        isCorrect,
        correctAnswer: isCorrect ? undefined : question.correctOption,
        explanation: question.explanation,
        stats: question.stats
    };

    res.json(response);
});

// @desc    Get questions by subject
// @route   GET /api/questions/subject/:subjectId
// @access  Public
exports.getQuestionsBySubject = asyncHandler(async (req, res) => {
    const questions = await Question.find({ subject: req.params.subjectId })
        .populate('topic', 'name')
        .sort({ year: -1, questionNumber: 1 });
    
    res.json(questions);
});

// @desc    Get questions by topic
// @route   GET /api/questions/topic/:topicId
// @access  Public
exports.getQuestionsByTopic = asyncHandler(async (req, res) => {
    const questions = await Question.find({ topic: req.params.topicId })
        .populate('subject', 'name')
        .sort({ year: -1, questionNumber: 1 });
    
    res.json(questions);
});

// @desc    Get questions by year and month
// @route   GET /api/questions/year/:year/:month?
// @access  Public
exports.getQuestionsByYear = asyncHandler(async (req, res) => {
    const { year, month } = req.params;
    const query = { year };
    
    if (month) {
        query.month = month;
    }
    
    const questions = await Question.find(query)
        .populate('subject', 'name')
        .populate('topic', 'name')
        .sort({ paper: 1, questionNumber: 1 });
    
    res.json(questions);
});

// @desc    Get random questions for practice
// @route   GET /api/questions/practice/random
// @access  Private
exports.getRandomQuestions = asyncHandler(async (req, res) => {
    const { subject, topic, difficulty, limit = 10 } = req.query;
    
    const query = { isVerified: true };
    if (subject) query.subject = subject;
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;
    
    const count = await Question.countDocuments(query);
    const random = Math.floor(Math.random() * (count - parseInt(limit)));
    
    const questions = await Question.find(query)
        .skip(random)
        .limit(parseInt(limit))
        .select('-correctOption -explanation -officialAnswerKey -officialAnswerKeyLink -isVerified -addedBy -__v -createdAt -updatedAt');
    
    res.json(questions);
});
