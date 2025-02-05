import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  from: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  to: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  // For admin monitoring
  adminViews: [{
    admin: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    viewedAt: { 
      type: Date, 
      default: Date.now 
    }
  }]
});

// Index for efficient querying of conversations
messageSchema.index({ from: 1, to: 1, timestamp: -1 });
messageSchema.index({ to: 1, read: 1 });

export const Message = mongoose.model('Message', messageSchema);
