const mongoose = require('mongoose');

const requestTypeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  category: {
    type: String,
    required: true
  },
  estimatedResponseTime: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Méthode statique pour trouver les types actifs
requestTypeSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

module.exports = mongoose.model('RequestType', requestTypeSchema);