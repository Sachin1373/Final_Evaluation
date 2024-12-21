import React, { useState,useEffect } from 'react';
import { useTheme } from '../Contexts/ThemeContext'; 
import CreateFolder from '../Modals/CreateFolder';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import CreateFormbtn from '../Components/CreateFormbtn';
import { FaFolderPlus } from "react-icons/fa";
import styles from "../Styles/Dashboard.module.css";

function Dashboard() {
  const { isDarkMode, toggleTheme } = useTheme(); 
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("userdetails")) || null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [foldermodal, setfoldermodal] = useState(false);

//    // Retrieve user details from localStorage
//    const storedUser = localStorage.getItem("userdetails");
//    if (!storedUser) {
//      toast.error("User not logged in!");
//      return;
//    }

//    // Parse the stored data
//    const { token, Username: username } = JSON.parse(storedUser);
   

  const openfoldermodal = () => {
    setfoldermodal(true); // Open the modal
  };

  const closefoldermodal = () => {
    setfoldermodal(false); // Close the modal
  };


  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const createdashboard = async () => {
    try {
  
      // Make API request
      const response = await axios.post(
        "http://localhost:8000/api/v1/dashboard/createdashboard",
        { username: userDetails.Username }, // Send username in the body
        {
          headers: {
            Authorization: `Bearer ${userDetails.token}`, // Include token in headers
          },
        }
      );
  
     
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server error. Please try again later.");
    }
  };
  

  useEffect(() => {
    createdashboard()
  }, [userDetails])
  

  return (
      <>
           <ToastContainer />
         <div className={`${styles.wrapper} ${isDarkMode ? styles.dark : styles.light}`}>
      <nav className={`${styles.navbar} ${isDarkMode ? styles.dark : styles.light}`}>
        <div className={`${styles.workspace_dropdown} ${isDarkMode ? styles.dark : styles.light}`}>
          <div className={`${styles.workspace_name} ${isDarkMode ? styles.textDark : styles.textLight}`} onClick={toggleDropdown}>
            <span className={`${styles.workspace_text} ${isDarkMode ? styles.textDark : styles.textLight}`}>
              {userDetails?.Username} Workspace
            </span>
            {isDropdownOpen ? <IoIosArrowUp className={styles.arrow_icon} /> : <IoIosArrowDown className={styles.arrow_icon} />}
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdown_menu}>
              <div className={`${styles.dropdown_item} ${isDarkMode ? styles.textDark : styles.textLight}`}>Shared Dashboard 1</div>
              <div className={`${styles.dropdown_item} ${isDarkMode ? styles.textDark : styles.textLight}`}>Settings</div>
              <div className={`${styles.dropdown_item} ${isDarkMode ? styles.textDark : styles.textLight}`} style={{ color: 'orange' }}>Logout</div>
            </div>
          )}
        </div>

        <div className={styles.right_section}>
          <span className={`${styles.theme_label} ${isDarkMode ? styles.textDark : styles.textLight}`}>
            <p className={`${styles.light_mode} ${isDarkMode ? styles.dark : styles.light}`}>Light</p>
            <label className={styles.switch}>
              <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
              <span className={`${styles.slider} ${styles.round}`}></span>
            </label>
            <p className={`${styles.Dark_mode} ${isDarkMode ? styles.dark : styles.light}`}>Dark</p>
          </span>
          <button className={`${styles.share_button} ${isDarkMode ? styles.dark : styles.light}`}>
            Share
          </button>
        </div>
      </nav>

      <div className={styles.folder_wrapper}>
        <div className={`${styles.create_folder} ${isDarkMode ? styles.dark : styles.light}`}>
          <FaFolderPlus className={styles.folder_icon} />
          <p onClick={openfoldermodal}>Create a folder</p>
        </div>
      </div>

      {foldermodal && <CreateFolder closeModal={closefoldermodal} />}

      <div className={styles.forms_wrapper}>
        <div className={styles.Create_TypeBot}>
          <CreateFormbtn />
        </div>
      </div>
      
     

    </div>
      </>
  );
}

export default Dashboard;
