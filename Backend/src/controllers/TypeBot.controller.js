import dashboard from "../models/DashBoardSchema.model.js";
import Folder from "../models/FolderSchema.model.js";
import Form from "../models/TypeBotSchema.modal.js";


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

export const getTypeBot = async(req,res) =>{
    const { userId } = req;
    const { folderId } = req.query;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized access. Token is invalid or missing." });
    }
    
    let forms;

    if (folderId) {
      // Fetch forms by folderId
      forms = await Form.find({ folderId });
    } else {
        const userDashboard = await dashboard.findOne({ owner: userId });

        if (!userDashboard) {
            return res.status(404).json({ message: "Dashboard not found for the user." });
        }

      forms = await Form.find({
        dashboardId: userDashboard._id, // Assuming dashboardId corresponds to userId
        folderId: null, // Only standalone forms
      });
    }

    if (!forms || forms.length === 0) {
        return res.status(404).json({ message: 'No forms found!.' });
      }
  
      return res.status(200).json(forms);

}

export const deleteTypeBot = async(req,res) =>{
    const { typeBotId } = req.query;

    await Folder.updateMany(
      { forms: typeBotId },  // Assuming `forms` is an array of form IDs in the folder
      { $pull: { forms: typeBotId } }  // Remove the formId from the `forms` array in the folder
    );

    await Form.findByIdAndDelete(typeBotId)

    return res.status(200).json({message : 'TypeBot Deleted'})
}