const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        uppercase: true
    },
    description: {
        type: String,
        default: ''
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    parentTopic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        default: null
    },
    subTopics: [{
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
    },
    isActive: {
        type: Boolean,
        default: true
    },
    resources: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ['pdf', 'video', 'article', 'other']
        },
        isFree: {
            type: Boolean,
            default: true
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for topic's URL
topicSchema.virtual('url').get(function() {
    return `/topics/${this._id}`;
});

// Update question count when questions are added/removed
topicSchema.virtual('questions', {
    ref: 'Question',
    localField: '_id',
    foreignField: 'topic'
});

// Update question count when saving
topicSchema.pre('save', async function(next) {
    if (this.isNew) {
        this.questionCount = 0;
    }
    next();
});

// Update question count after saving/deleting questions
topicSchema.post('findOneAndUpdate', async function(doc) {
    if (doc) {
        const Question = require('./Question');
        const count = await Question.countDocuments({ topic: doc._id });
        doc.questionCount = count;
        await doc.save();
    }
});

// Add topic to parent's subTopics array
topicSchema.post('save', async function(doc) {
    if (doc.parentTopic) {
        await this.model('Topic').findByIdAndUpdate(
            doc.parentTopic,
            { $addToSet: { subTopics: doc._id } }
        );
    }
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
