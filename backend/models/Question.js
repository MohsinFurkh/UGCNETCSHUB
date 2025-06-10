const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    explanation: {
        type: String,
        default: ''
    }
});


const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
        trim: true
    },
    options: [optionSchema],
    correctOption: {
        type: Number,
        required: true
    },
    explanation: {
        type: String,
        default: ''
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    month: {
        type: String,
        enum: ['June', 'December'],
        required: true
    },
    paper: {
        type: String,
        enum: ['Paper 1', 'Paper 2', 'Paper 3'],
        required: true
    },
    questionNumber: {
        type: Number,
        required: true
    },
    officialAnswerKey: {
        type: String,
        default: ''
    },
    officialAnswerKeyLink: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: [{
        type: String,
        trim: true
    }],
    stats: {
        totalAttempts: {
            type: Number,
            default: 0
        },
        correctAttempts: {
            type: Number,
            default: 0
        },
        accuracy: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for question's URL
questionSchema.virtual('url').get(function() {
    return `/questions/${this._id}`;
});

// Update accuracy before saving
questionSchema.pre('save', function(next) {
    if (this.stats.totalAttempts > 0) {
        this.stats.accuracy = (this.stats.correctAttempts / this.stats.totalAttempts) * 100;
    }
    next();
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
