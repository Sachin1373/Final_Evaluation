import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dashboardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dashboard", // Reference to the Dashboard model
      required: true,
    },
    forms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
      },
    ],
  },
  { timestamps: true }
);

const Folder = mongoose.model("Folder",FolderSchema)

export default Folder
