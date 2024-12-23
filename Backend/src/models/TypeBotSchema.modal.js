import mongoose from "mongoose";

const FormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Form name is required"],
      trim: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // Flexible field to store any data structure
      default: {}, // Default to an empty object or structure
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder", // Reference to the Folder schema
      default: null, // Null if it doesn't belong to a folder
    },
    dashboardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dashboard", // Reference to the Dashboard schema
      default : null, 
    },
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", FormSchema);

export default Form;
