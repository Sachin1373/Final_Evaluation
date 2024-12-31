import mongoose from 'mongoose';

const formResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  startCount: {
    type: Number,
    default: 0
  },
  responses: [{
    date: {
      type: Date,
      default: Date.now
    },
    data: [{
      label: String,
      type: String,
      data: String
    }]
  }]
}, { timestamps: true });

const FormResponse = mongoose.model('FormResponse', formResponseSchema);


