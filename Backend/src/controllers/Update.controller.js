import bcrypt from "bcrypt"
import User from "../models/UserSchema.model.js"

export const updateuserdetails = async(req,res) =>{
    const { name, email, oldPassword, newPassword } = req.body;
    const {userId} = req

    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update name and email directly
    if (name) user.username = name;
    if (email) user.email = email;

    if (newPassword) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Old password is incorrect' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({ message: 'User details updated successfully', username: user.username });


}