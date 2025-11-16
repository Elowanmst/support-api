const mongoose = require('mongoose');

const requestTypeSchema = new mongoose.Schema({
  code: {
    type: String,

    required: [true, 'Code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'critical'],
      message: 'Priority must be one of: low, medium, high, critical'
    },

    default: 'medium'
  },
  category: {
    type: String,

    required: [true, 'Category is required'],
    trim: true
  },
  estimatedResponseTime: {
    type: Number,
    required: [true, 'Estimated response time is required'],
    min: [1, 'Estimated response time must be at least 1 hour']

  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {

  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances de recherche
requestTypeSchema.index({ code: 1 });
requestTypeSchema.index({ isActive: 1 });

// Méthode statique pour récupérer les types actifs
requestTypeSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ priority: -1, name: 1 });
};

// Méthode d'instance pour activer/désactiver
requestTypeSchema.methods.toggleActive = function() {
  this.isActive = !this.isActive;
  return this.save();
};

const RequestType = mongoose.model('RequestType', requestTypeSchema);

module.exports = RequestType;

