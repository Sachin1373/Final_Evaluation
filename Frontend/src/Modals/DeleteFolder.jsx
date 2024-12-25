// In DeleteFolder.js
import React from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import styles from '../Styles/DeleteFolder.module.css';

function DeleteFolder({closeModal, refreshFolders, folderId}) {
  const userDetails = JSON.parse(localStorage.getItem("UserDetails")) || null;

  const handleCancel = () => {
    closeModal();
  }

  const handleDeleteFolder = async (folderId) => {
    try {
      const response = await axios.delete(`https://final-evaluation-qbj9.onrender.com/api/v1/folder/deletefolder/${folderId}`, {
        headers: {
          Authorization: `Bearer ${userDetails.token}`,
        },
      });
      toast.success(response?.data?.message);
      await refreshFolders(); 
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete folder.");
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Are you sure you want to delete this folder?</h2>
        <div className={styles.buttons}>
          <button className={styles.doneButton} onClick={() => handleDeleteFolder(folderId)}>Confirm</button>
          <div className={styles.divider}></div>
          <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteFolder;