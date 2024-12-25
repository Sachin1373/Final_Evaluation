import Dashboard from "../models/DashBoardSchema.model.js";
import User from "../models/UserSchema.model.js"
import Form from "../models/TypeBotSchema.modal.js";

export const dashboard = async (req, res) => {
  // Extract username from req.body and userId from the middleware
  const { username } = req.body;
  const { userId } = req;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized access. Token is invalid or missing." });
    return;
  }

  if (!username) {
    res.status(400).json({ message: "Username is required to create or fetch the dashboard." });
    return;
  }

  // Check if the dashboard for the user already exists
  let userDashboard = await Dashboard.findOne({ owner: userId });

  if (!userDashboard) {
    // If no dashboard exists, create one
    userDashboard = new Dashboard({
      owner: userId,
      name: username,
      folders: [], // Initially empty
      individualForms: [], // Initially empty
    });

    await userDashboard.save();
    
    let user  = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    user.dashboard = userDashboard._id
    await user.save()

    res.status(201).json({ message: "Dashboard created successfully.", dashboard: userDashboard });
    return;
  }

  // If the dashboard already exists, return it
  res.status(200).json({ message: "Dashboard fetched successfully.", dashboard: userDashboard });
};


export const sharedashboard = async(req,res) =>{
  const { email, permission } = req.body;
  const { userId } = req;
  

  if (!email || !permission) {
    return res.status(400).json({ message: "Email and permission are required" });
  }
  
  // find User A's dashboard
  const dashboardA = await Dashboard.findOne({ owner: userId });
    if (!dashboardA) {
      return res.status(404).json({ message: "User A's dashboard not found" });
    }

    // Find User B by email
    const userB = await User.findOne({ email });
    if (!userB) {
      return res.status(404).json({ message: "User B not found" });
    }

    // Find  User B's dashboard
    let dashboardB = await Dashboard.findOne({ owner: userB._id });

     // Check if the dashboard is already shared
     const sharedIndex = dashboardB.sharedWith.findIndex(
      (shared) => shared.dashboard.toString() === dashboardA._id.toString()
    );

    if (sharedIndex !== -1) {
      // If already shared, check the permission
      if (dashboardB.sharedWith[sharedIndex].permission === permission) {
        return res.status(400).json({ message: "Dashboard already shared with the same permission." });
      } else {
        // Update the permission if it's different
        dashboardB.sharedWith[sharedIndex].permission = permission;
        await dashboardB.save();
        return res.status(200).json({ message: "Permission updated successfully." });
      }
    }
    
    // Add User A's dashboard to User B's shared list with permission
    dashboardB.sharedWith.push({
      dashboard: dashboardA._id,
      permission,
    });
    
    await dashboardB.save();

    res.status(200).json({ message: "Dashboard shared successfully", shareddashboarId: dashboardA._id, });

}

export const shareddashboardID = async(req,res)=>{

}

export const sharedashboarddetails = async(req,res) =>{
  const { dashboardId } = req.params;

  const dashboard = await Dashboard.findById(dashboardId)
  .populate({
    path: "folders",
    populate: {
      path: "forms", // Assuming "forms" is an array inside "FolderSchema"
      model: "Form", // Referencing the Form model
    },
  })
  .populate("standaloneForms");

  if (!dashboard) {
    return res.status(404).json({ message: "Dashboard not found" });
  }

  res.status(200).json({
    message: "Dashboard details fetched successfully",
    dashboard,
  });
}