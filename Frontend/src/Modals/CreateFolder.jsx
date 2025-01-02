import React, { useState } from 'react';
import { useTheme } from '../Contexts/ThemeContext'; 
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Styles/CreateFolder.module.css";


function CreateFolder({ closeModal, refreshFolders, shareddashid }) {
  const [folderName, setFolderName] = useState("");
  const { isDarkMode, toggleTheme } = useTheme(); 
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("UserDetails")) || null);

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleDone = async() => {
    try {
     
      const response = await axios.post(
        "https://final-evaluation-qbj9.onrender.com/api/v1/folder/createfolder",
        { name: folderName,
          dashboardID : shareddashid,
         }, 
        {
          headers: {
            Authorization: `Bearer ${userDetails.token}`, 
          },
        }
      );

      toast.success(response.data.message);
      closeModal();
      await  refreshFolders()
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error creating folder. Please try again.");
    } 
  };

  const handleCancel = () => {
    closeModal(); 
  };

  

  return (
    <div className={styles.modal}>
       <ToastContainer />
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Create New Folder</h2>
        <input
          type="text"
          className={styles.folderInput}
          value={folderName}
          onChange={handleFolderNameChange}
          placeholder="Enter folder name"
        />
        <div className={styles.buttons}>
          <button className={styles.doneButton} onClick={handleDone}>Done</button>
          <div className={styles.divider}></div>
          <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default CreateFolder;
