import Dashboard from "../models/DashBoardSchema.model.js";
import User from "../models/UserSchema.model.js"

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
  const {userAId} = req.userId;

  if (!email || !permission) {
    return res.status(400).json({ message: "Email and permission are required" });
  }
  
  // find User A's dashboard
  const dashboardA = await Dashboard.findOne({ owner: userAId });
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
    
    // Add User A's dashboard to User B's shared list with permission
    dashboardB.sharedWith.push({
      dashboard: dashboardA._id,
      permission,
    });
    
    await dashboardB.save();

    res.status(200).json({ message: "Dashboard shared successfully" });

}