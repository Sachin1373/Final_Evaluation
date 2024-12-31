import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }, 
});

const formResponseSchema = new mongoose.Schema(
  {
    formId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Form" },
    viewCount: { type: Number, default: 0 },
    startCount: { type: Number, default: 0 },
    responses: [responseSchema],
    submittedAt: { type: Date }, 
  },
  { timestamps: true }
);

const FormResponse = mongoose.model("FormResponse", formResponseSchema);

export default FormResponse;


