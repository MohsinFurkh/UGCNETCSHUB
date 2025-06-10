const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    description: {
        type: String,
        default: ''
    },
    syllabus: {
        type: String,
        default: ''
    },
    isCore: {
        type: Boolean,
        default: true
    },
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }],
    questionCount: {
        type: Number,
        default: 0
    },
    weightage: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for subject's URL
subjectSchema.virtual('url').get(function() {
    return `/subjects/${this.code.toLowerCase()}`;
});

// Update question count when questions are added/removed
subjectSchema.virtual('questions', {
    ref: 'Question',
    localField: '_id',
    foreignField: 'subject'
});

// Update question count when saving
subjectSchema.pre('save', async function(next) {
    if (this.isNew) {
        this.questionCount = 0;
    }
    next();
});

// Update question count after saving/deleting questions
subjectSchema.post('findOneAndUpdate', async function(doc) {
    if (doc) {
        const Question = require('./Question');
        const count = await Question.countDocuments({ subject: doc._id });
        doc.questionCount = count;
        await doc.save();
    }
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
