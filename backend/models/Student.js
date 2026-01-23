import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true
  },
  rollNumber: { 
    type: String, 
    default: null 
  },
  fullName: { 
    type: String, 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLoginAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for fast email lookup
StudentSchema.index({ email: 1 });

export default mongoose.model('Student', StudentSchema);
