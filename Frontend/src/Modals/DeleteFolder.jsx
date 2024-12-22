import React from 'react'
import styles from '../Styles/DeleteFolder.module.css'
function DeleteFolder({closeModal, handleDeleteFolder, folderId}) {


  const handleCancel = () =>{
    closeModal()
  }

  const handledone = () => {
    handleDeleteFolder(folderId); 
    closeModal(); 
  };

  return (
    <div className={styles.modal}>
   
   <div className={styles.modalContent}>
     <h2 className={styles.heading}>Are you sure you want to 
     delete this folder ?</h2>
    
     <div className={styles.buttons}>
       <button className={styles.doneButton} onClick={handledone} >Done</button>
       <div className={styles.divider}></div>
       <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
     </div>
   </div>
 </div>
  )
}

export default DeleteFolder