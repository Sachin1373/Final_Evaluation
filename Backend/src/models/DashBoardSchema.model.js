import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "My Workspace"
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    folders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }],
    standaloneForms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }],
    sharedWith: [
      {
        dashboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Dashboard' },
        permission: { type: String, enum: ['view', 'edit'], required: true },
      },
    ],
  },
  { timestamps: true }
);

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

export default Dashboard;
