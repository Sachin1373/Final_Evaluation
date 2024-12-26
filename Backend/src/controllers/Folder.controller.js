import dashboard from "../models/DashBoardSchema.model.js";
import Folder from "../models/FolderSchema.model.js";
import Form from "../models/TypeBotSchema.modal.js";

export const createfolder = async (req, res) => {
  const { name, dashboardID } = req.body;
  const { userId } = req;

  if (!name) {
    return res.status(400).json({ message: 'Folder name and Dashboard ID are required.' });
  }
 

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access. Token is invalid or missing." });
  }

  let dashboardId
  let userDashboard
  if(dashboardID){
      dashboardId = dashboardID
  }else{
     userDashboard = await dashboard.findOne({ owner: userId });

    if (!userDashboard) {
      return res.status(404).json({ message: "Dashboard not found for the user." });
    }

    dashboardId = userDashboard._id;
  }

  // Check if the folder already exists in the dashboard
  const existingFolder = await Folder.findOne({ name, dashboardId });
  if (existingFolder) {
    return res.status(400).json({ message: "Folder with this name already exists in the dashboard." });
  }

  // Create a new folder
  const folder = new Folder({ name, dashboardId }); // Ensure dashboardId is passed correctly
  await folder.save();


  userDashboard.folders.push(folder._id);
  await userDashboard.save();

  res.status(201).json({ message: "Folder created successfully.", folder });
};

export const getfolders = async (req, res) => {
    const { userId } = req;
    const {dashboardID} = req.query;
  
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access. Token is invalid or missing." });
    }
    
    
    let dashboardId

    if(dashboardID){
           dashboardId = dashboardID
    }else{
      const userDashboard = await dashboard.findOne({ owner: userId });
  
        if (!userDashboard) {
         return res.status(404).json({ message: "Dashboard not found for the user." });
        }
  
         dashboardId = userDashboard._id; 
    }

   
    // Find folders associated with the user's dashboard
    const folders = await Folder.find({ dashboardId });

    if(!folders || folders.length==0){
      return res.status(404).json({ message : "No Folders Found!."})
    }
    res.status(200).json({ message: "Folders fetched successfully.", folders });
  };

export const deletefolder = async(req,res)=>{
  const { folderId } = req.params;

  const folder = await Folder.findById(folderId);

  if (!folder) {
    return res.status(404).json({ message: 'Folder not found.' });
  }
  
  await Form.deleteMany({ folderId });

  await Folder.findByIdAndDelete(folderId);

  res.status(200).json({ message: 'Folder deleted successfully.' });

}