const Topic = require('../models/Topic');
const Question = require('../models/Question');
const Subject = require('../models/Subject');
const asyncHandler = require('express-async-handler');

// @desc    Get all topics
// @route   GET /api/topics
// @access  Public
exports.getTopics = asyncHandler(async (req, res) => {
    const { subject, parent } = req.query;
    const query = {};
    
    if (subject) {
        query.subject = subject;
    }
    
    if (parent === 'null') {
        query.parentTopic = { $in: [null, undefined] };
    } else if (parent) {
        query.parentTopic = parent;
    }
    
    const topics = await Topic.find(query)
        .populate('subject', 'name code')
        .populate('parentTopic', 'name')
        .sort('name');
    
    res.json(topics);
});

// @desc    Get single topic by ID
// @route   GET /api/topics/:id
// @access  Public
exports.getTopicById = asyncHandler(async (req, res) => {
    const topic = await Topic.findById(req.params.id)
        .populate('subject', 'name code')
        .populate('parentTopic', 'name code')
        .populate('subTopics', 'name code questionCount');
    
    if (topic) {
        res.json(topic);
    } else {
        res.status(404);
        throw new Error('Topic not found');
    }
});

// @desc    Create a topic
// @route   POST /api/topics
// @access  Private/Admin
exports.createTopic = asyncHandler(async (req, res) => {
    const { 
        name, 
        code, 
        description, 
        subject, 
        parentTopic, 
        weightage, 
        isActive,
        resources 
    } = req.body;
    
    // Check if subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
        res.status(400);
        throw new Error('Invalid subject');
    }
    
    // Check if parent topic exists if provided
    if (parentTopic) {
        const parentTopicExists = await Topic.findById(parentTopic);
        if (!parentTopicExists) {
            res.status(400);
            throw new Error('Parent topic not found');
        }
        
        // Ensure parent topic belongs to the same subject
        if (parentTopicExists.subject.toString() !== subject) {
            res.status(400);
            throw new Error('Parent topic must belong to the same subject');
        }
    }
    
    const topic = new Topic({
        name,
        code,
        description,
        subject,
        parentTopic: parentTopic || null,
        weightage: weightage || 0,
        isActive: isActive !== undefined ? isActive : true,
        resources: resources || []
    });
    
    const createdTopic = await topic.save();
    
    // Add topic to subject's topics array if not already present
    if (!subjectExists.topics.includes(createdTopic._id)) {
        subjectExists.topics.push(createdTopic._id);
        await subjectExists.save();
    }
    
    res.status(201).json(createdTopic);
});

// @desc    Update a topic
// @route   PUT /api/topics/:id
// @access  Private/Admin
exports.updateTopic = asyncHandler(async (req, res) => {
    const { 
        name, 
        code, 
        description, 
        subject, 
        parentTopic, 
        weightage, 
        isActive,
        resources 
    } = req.body;
    
    const topic = await Topic.findById(req.params.id);
    
    if (!topic) {
        res.status(404);
        throw new Error('Topic not found');
    }
    
    // Check if subject is being changed
    if (subject && subject !== topic.subject.toString()) {
        // Check if new subject exists
        const newSubject = await Subject.findById(subject);
        if (!newSubject) {
            res.status(400);
            throw new Error('Invalid subject');
        }
        
        // Remove topic from old subject's topics array
        const oldSubject = await Subject.findById(topic.subject);
        if (oldSubject) {
            oldSubject.topics = oldSubject.topics.filter(
                topicId => topicId.toString() !== topic._id.toString()
            );
            await oldSubject.save();
        }
        
        // Add topic to new subject's topics array
        if (!newSubject.topics.includes(topic._id)) {
            newSubject.topics.push(topic._id);
            await newSubject.save();
        }
        
        topic.subject = subject;
    }
    
    // Check if parent topic is being changed
    if (parentTopic !== undefined) {
        if (parentTopic && parentTopic !== topic.parentTopic?.toString()) {
            // Check if parent topic exists
            const parentTopicExists = await Topic.findById(parentTopic);
            if (!parentTopicExists) {
                res.status(400);
                throw new Error('Parent topic not found');
            }
            
            // Prevent circular references
            if (parentTopic === req.params.id) {
                res.status(400);
                throw new Error('A topic cannot be its own parent');
            }
            
            // Check if parent topic is a descendant of this topic
            let currentParentId = parentTopic;
            while (currentParentId) {
                const currentParent = await Topic.findById(currentParentId);
                if (!currentParent) break;
                if (currentParent.parentTopic?.toString() === req.params.id) {
                    res.status(400);
                    throw new Error('Cannot create circular reference in topic hierarchy');
                }
                currentParentId = currentParent.parentTopic;
            }
            
            topic.parentTopic = parentTopic;
        } else if (parentTopic === null) {
            topic.parentTopic = null;
        }
    }
    
    // Update other fields
    if (name) topic.name = name;
    if (code) topic.code = code;
    if (description !== undefined) topic.description = description;
    if (weightage !== undefined) topic.weightage = weightage;
    if (isActive !== undefined) topic.isActive = isActive;
    if (resources) topic.resources = resources;
    
    const updatedTopic = await topic.save();
    res.json(updatedTopic);
});

// @desc    Delete a topic
// @route   DELETE /api/topics/:id
// @access  Private/Admin
exports.deleteTopic = asyncHandler(async (req, res) => {
    const topic = await Topic.findById(req.params.id);
    
    if (!topic) {
        res.status(404);
        throw new Error('Topic not found');
    }
    
    // Check if there are questions associated with this topic
    const questionCount = await Question.countDocuments({ topic: topic._id });
    if (questionCount > 0) {
        res.status(400);
        throw new Error('Cannot delete topic with associated questions');
    }
    
    // Check if there are subtopics
    const subtopicCount = await Topic.countDocuments({ parentTopic: topic._id });
    if (subtopicCount > 0) {
        res.status(400);
        throw new Error('Cannot delete topic with subtopics');
    }
    
    // Remove topic from subject's topics array
    const subject = await Subject.findById(topic.subject);
    if (subject) {
        subject.topics = subject.topics.filter(
            topicId => topicId.toString() !== topic._id.toString()
        );
        await subject.save();
    }
    
    // Remove topic from parent topic's subTopics array
    if (topic.parentTopic) {
        await Topic.findByIdAndUpdate(
            topic.parentTopic,
            { $pull: { subTopics: topic._id } }
        );
    }
    
    await topic.remove();
    res.json({ message: 'Topic removed' });
});

// @desc    Get topic statistics
// @route   GET /api/topics/:id/stats
// @access  Private
exports.getTopicStats = asyncHandler(async (req, res) => {
    const topicId = req.params.id;
    
    // Get topic with subtopics
    const topic = await Topic.findById(topicId)
        .populate('subTopics', 'name code questionCount')
        .populate('subject', 'name code');
    
    if (!topic) {
        res.status(404);
        throw new Error('Topic not found');
    }
    
    // Get all descendant topic IDs (including subtopics recursively)
    const getAllDescendantIds = async (topicId) => {
        const descendants = [];
        const queue = [topicId];
        
        while (queue.length > 0) {
            const currentId = queue.shift();
            const subtopics = await Topic.find({ parentTopic: currentId }, '_id');
            const subtopicIds = subtopics.map(st => st._id);
            
            descendants.push(...subtopicIds);
            queue.push(...subtopicIds);
        }
        
        return descendants;
    };
    
    const allTopicIds = [topic._id, ...(await getAllDescendantIds(topic._id))];
    
    // Get question count by year for all topics
    const questionsByYear = await Question.aggregate([
        { $match: { topic: { $in: allTopicIds } } },
        { $group: { _id: '$year', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
    
    // Get question count by difficulty for all topics
    const questionsByDifficulty = await Question.aggregate([
        { $match: { topic: { $in: allTopicIds } } },
        { $group: { _id: '$difficulty', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
    
    // Get total question count
    const questionCount = await Question.countDocuments({ topic: { $in: allTopicIds } });
    
    // Get subtopics with question counts
    const subtopicsWithCounts = await Promise.all(topic.subTopics.map(async (subtopic) => {
        const subtopicIds = [subtopic._id, ...(await getAllDescendantIds(subtopic._id))];
        const count = await Question.countDocuments({ topic: { $in: subtopicIds } });
        return {
            _id: subtopic._id,
            name: subtopic.name,
            code: subtopic.code,
            questionCount: count
        };
    }));
    
    res.json({
        topic: {
            _id: topic._id,
            name: topic.name,
            code: topic.code,
            description: topic.description,
            subject: topic.subject,
            questionCount,
            weightage: topic.weightage
        },
        subtopics: subtopicsWithCounts,
        questionsByYear,
        questionsByDifficulty,
        totalQuestions: questionCount
    });
});

// @desc    Search topics
// @route   GET /api/topics/search
// @access  Public
exports.searchTopics = asyncHandler(async (req, res) => {
    const { q, subject } = req.query;
    
    if (!q) {
        res.status(400);
        throw new Error('Search query is required');
    }
    
    const query = {
        name: { $regex: q, $options: 'i' }
    };
    
    if (subject) {
        query.subject = subject;
    }
    
    const topics = await Topic.find(query)
        .populate('subject', 'name code')
        .limit(10)
        .select('name code subject questionCount');
    
    res.json(topics);
});
