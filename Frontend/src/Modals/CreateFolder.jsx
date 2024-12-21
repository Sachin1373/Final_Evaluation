import React, { useState } from 'react';
import { useTheme } from '../Contexts/ThemeContext'; 
import styles from "../Styles/CreateFolder.module.css";

function CreateFolder({ closeModal }) {
  const [folderName, setFolderName] = useState("");
   const { isDarkMode, toggleTheme } = useTheme(); 

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleDone = () => {
    // Handle folder creation logic here (if needed)
    closeModal(); // Close modal after action
  };

  const handleCancel = () => {
    closeModal(); // Close modal without action
  };

  return (
    <div className={styles.modal}>
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
