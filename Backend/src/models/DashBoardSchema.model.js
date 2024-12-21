import mongoose from "mongoose"

const dashboardSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "My Workspace"
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }],
  standaloneForms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }], // Forms not inside folders
}, { timestamps: true });



const dashboard = mongoose.model("dashboard",dashboardSchema)

export default dashboard;