import dashboard from "../models/DashBoardSchema.model";
import Folder from "../models/FolderSchema.model";
import Form from "../models/TypeBotSchema.modal";


 export const createtypebot = async(req,res) =>{
    const { name, folderId } = req.body;
    const { userId } = req;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized access. Token is invalid or missing." });
    }

    const userDashboard = await dashboard.findOne({ owner: userId });

    if (!userDashboard) {
        return res.status(404).json({ message: "Dashboard not found for the user." });
    }

    let newTypeBot;
    
    if (folderId) {
        // If a folder is selected, validate the folder
        const selectedFolder = await Folder.findById(folderId);
        if (!selectedFolder) {
          return res.status(404).json({ message: "Folder not found." });
        }
  
        // Create the TypeBot with folder reference
        newTypeBot = new Form({
          name,
          folderId,
          dashboardId: null,
        });
  
        await newTypeBot.save();
  
        // Update the Folder schema to reference the new TypeBot
        selectedFolder.forms.push(newTypeBot._id);
        await selectedFolder.save();
    } else {
        // If no folder is selected, create the TypeBot without folder reference
        newTypeBot = new Form({
          name,
          folderId: null,
          dashboardId: userDashboard._id,
        });
  
        await newTypeBot.save();
  
        // Update the Dashboard schema to reference the new TypeBot in standaloneForms
        userDashboard.standaloneForms.push(newTypeBot._id);
        await userDashboard.save();
    }

    res.status(201).json({ message: "TypeBot created successfully.", typeBot: newTypeBot });
  
}