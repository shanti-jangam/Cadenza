const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const compositionSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  melody: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shareCount: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  notes: [{
    note: String,
    timestamp: Number,
    duration: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Composition = mongoose.model('Composition', compositionSchema);

module.exports = Composition;