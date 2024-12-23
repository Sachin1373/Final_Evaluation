import React from 'react'
import styles from '../Styles/DeleteFolder.module.css'
function DeleteTypeBot({closeModal, deleteform, typebot}) {

    const handleCancel = () =>{
        closeModal()
      }
    
      const handledone = () => {
        deleteform(typebot); 
        closeModal(); 
      };
  return (
      <div className={styles.modal}>
         
         <div className={styles.modalContent}>
           <h2 className={styles.heading}>Are you sure you want to 
           delete this Form ?</h2>
          
           <div className={styles.buttons}>
             <button className={styles.doneButton} onClick={handledone} >Confirm</button>
             <div className={styles.divider}></div>
             <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
           </div>
         </div>
       </div>
  )
}

export default DeleteTypeBot