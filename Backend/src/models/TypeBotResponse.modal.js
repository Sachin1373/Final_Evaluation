import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String, required: true },
  data: mongoose.Schema.Types.Mixed, // Can store text, URLs, numbers, etc.
});

const submissionSchema = new mongoose.Schema({
  responses: [responseSchema], // Array of responses for a single submission
  submittedAt: { type: Date, default: Date.now }, // Tracks when the form was submitted
});

const formSchema = new mongoose.Schema({
  formId: {type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  views: { type: Number, default: 0 }, // Tracks how many times the form was viewed
  starts: { type: Number, default: 0 }, // Tracks when a user starts filling out the form
  submissions: [submissionSchema], // Array of form submissions
  createdAt: { type: Date, default: Date.now },
});

const FormResponse = mongoose.model('FormResponse', formSchema);

export default FormResponse


