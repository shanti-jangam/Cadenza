const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['composition', 'follow', 'like', 'comment', 'profile_update'],
    required: true
  },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetComposition: { type: mongoose.Schema.Types.ObjectId, ref: 'Composition' },
  description: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema); 