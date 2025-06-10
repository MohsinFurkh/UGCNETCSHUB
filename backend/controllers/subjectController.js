const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const asyncHandler = require('express-async-handler');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
exports.getSubjects = asyncHandler(async (req, res) => {
    const { isCore } = req.query;
    const query = {};
    
    if (isCore !== undefined) {
        query.isCore = isCore === 'true';
    }
    
    const subjects = await Subject.find(query)
        .sort({ name: 1 });
    
    res.json(subjects);
});

// @desc    Get single subject by ID
// @route   GET /api/subjects/:id
// @access  Public
exports.getSubjectById = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    
    if (subject) {
        res.json(subject);
    } else {
        res.status(404);
        throw new Error('Subject not found');
    }
});

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Private/Admin
exports.createSubject = asyncHandler(async (req, res) => {
    const { name, code, description, syllabus, isCore } = req.body;
    
    const subject = new Subject({
        name,
        code,
        description,
        syllabus,
        isCore: isCore !== undefined ? isCore : true
    });
    
    const createdSubject = await subject.save();
    res.status(201).json(createdSubject);
});

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
exports.updateSubject = asyncHandler(async (req, res) => {
    const { name, code, description, syllabus, isCore } = req.body;
    
    const subject = await Subject.findById(req.params.id);
    
    if (subject) {
        subject.name = name || subject.name;
        subject.code = code || subject.code;
        subject.description = description !== undefined ? description : subject.description;
        subject.syllabus = syllabus !== undefined ? syllabus : subject.syllabus;
        subject.isCore = isCore !== undefined ? isCore : subject.isCore;
        
        const updatedSubject = await subject.save();
        res.json(updatedSubject);
    } else {
        res.status(404);
        throw new Error('Subject not found');
    }
});

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
exports.deleteSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    
    if (subject) {
        // Check if there are topics associated with this subject
        const topicsCount = await Topic.countDocuments({ subject: subject._id });
        
        if (topicsCount > 0) {
            res.status(400);
            throw new Error('Cannot delete subject with associated topics');
        }
        
        await subject.remove();
        res.json({ message: 'Subject removed' });
    } else {
        res.status(404);
        throw new Error('Subject not found');
    }
});

// @desc    Get topics for a subject
// @route   GET /api/subjects/:id/topics
// @access  Public
exports.getTopicsBySubject = asyncHandler(async (req, res) => {
    const { parent } = req.query;
    const query = { subject: req.params.id };
    
    if (parent === 'null') {
        query.parentTopic = { $in: [null, undefined] };
    } else if (parent) {
        query.parentTopic = parent;
    }
    
    const topics = await Topic.find(query)
        .populate('subTopics', 'name code questionCount')
        .sort('name');
    
    res.json(topics);
});

// @desc    Get subject statistics
// @route   GET /api/subjects/:id/stats
// @access  Private
exports.getSubjectStats = asyncHandler(async (req, res) => {
    const subjectId = req.params.id;
    
    // Get total questions count for the subject
    const Question = require('../models/Question');
    const questionCount = await Question.countDocuments({ subject: subjectId });
    
    // Get topics with question counts
    const topics = await Topic.find({ subject: subjectId })
        .select('name code questionCount')
        .sort('name');
    
    // Get question count by year
    const questionsByYear = await Question.aggregate([
        { $match: { subject: subjectId } },
        { $group: { _id: '$year', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
    
    // Get question count by difficulty
    const questionsByDifficulty = await Question.aggregate([
        { $match: { subject: subjectId } },
        { $group: { _id: '$difficulty', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
    
    res.json({
        questionCount,
        topicCount: topics.length,
        topics,
        questionsByYear,
        questionsByDifficulty
    });
});
