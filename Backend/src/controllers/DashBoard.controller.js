import Dashboard from "../models/DashBoardSchema.model.js";

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
    res.status(201).json({ message: "Dashboard created successfully.", dashboard: userDashboard });
    return;
  }

  // If the dashboard already exists, return it
  res.status(200).json({ message: "Dashboard fetched successfully.", dashboard: userDashboard });
};
