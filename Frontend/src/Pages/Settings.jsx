import React, { useState, useContext } from 'react';
import { BsFillPersonFill } from "react-icons/bs";
import { LuEye, LuEyeOff } from "react-icons/lu"; // Include LuEyeOff for the "hidden" icon
import { CiLock } from "react-icons/ci"; 
import { AuthContext } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IoLogOutOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "../Styles/Settings.module.css";
import axios from 'axios';

function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("UserDetails")) || null);
  const [showEmail, setShowEmail] = useState(false); // State for email visibility
  const [showOldPassword, setShowOldPassword] = useState(false); // State for old password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/update/updateuserdetails",
        { name, email, oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${userDetails?.token}`, // Include the token in the headers
          },
        }
      );

      if (response.status === 200) {
        toast.success("User details updated successfully!");

        const updatedUserDetails = {
          ...userDetails,
          Username: response.data.username, 
        };
        localStorage.setItem("UserDetails", JSON.stringify(updatedUserDetails));
        setUserDetails(updatedUserDetails); 
      } else {
        toast.error("Failed to update user details.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while updating.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.settingsContainer}>
        <h2 className={styles.settingsHeading}>Settings</h2>
        <div className={styles.settingsBox}>
          <form className={styles.settingsForm}>
            <div className={styles.inputWrapper}>
              <BsFillPersonFill className={styles.inputIcon} />
              <input
                type="text"
                className={styles.settingsInput}
                placeholder="Update Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.inputWrapper}>
              <CiLock className={styles.inputIcon} />
              <input
                type={showEmail ? "text" : "email"} // Toggle input type for email
                className={styles.settingsInput}
                placeholder="Update Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {showEmail ? (
                <LuEyeOff
                  className={styles.eyeIcon}
                  onClick={() => setShowEmail(false)} // Hide email
                />
              ) : (
                <LuEye
                  className={styles.eyeIcon}
                  onClick={() => setShowEmail(true)} // Show email
                />
              )}
            </div>
            <div className={styles.inputWrapper}>
              <CiLock className={styles.inputIcon} />
              <input
                type={showOldPassword ? "text" : "password"} // Toggle input type for old password
                className={styles.settingsInput}
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              {showOldPassword ? (
                <LuEyeOff
                  className={styles.eyeIcon}
                  onClick={() => setShowOldPassword(false)} // Hide old password
                />
              ) : (
                <LuEye
                  className={styles.eyeIcon}
                  onClick={() => setShowOldPassword(true)} // Show old password
                />
              )}
            </div>
            <div className={styles.inputWrapper}>
              <CiLock className={styles.inputIcon} />
              <input
                type={showNewPassword ? "text" : "password"} // Toggle input type for new password
                className={styles.settingsInput}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {showNewPassword ? (
                <LuEyeOff
                  className={styles.eyeIcon}
                  onClick={() => setShowNewPassword(false)} // Hide new password
                />
              ) : (
                <LuEye
                  className={styles.eyeIcon}
                  onClick={() => setShowNewPassword(true)} // Show new password
                />
              )}
            </div>
            <button
              type="button"
              className={styles.updateButton}
              onClick={handleUpdate}
            >
              Update
            </button>
          </form>
        </div>
      </div>
      <div className={styles.logout_section} onClick={handleLogout}>
        <IoLogOutOutline className={styles.logout_icon} />
        <p>Log out</p>
      </div>
    </>
  );
}

export default Settings;
