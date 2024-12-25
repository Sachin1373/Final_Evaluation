import React from 'react'
import styles from '../Styles/DeleteFolder.module.css'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function DeleteTypeBot({closeModal, refreshtypebot, typebotId}) {

  const userDetails = JSON.parse(localStorage.getItem("UserDetails")) || null;

    const handleCancel = () =>{
        closeModal()
      }
    
      const deletetypebot = async(TypeBotId) =>{
        try {
          const response = await axios.delete(`https://final-evaluation-qbj9.onrender.com/api/v1/typebot/deleteTypeBot?typeBotId=${TypeBotId}`,{
            headers: {
              Authorization: `Bearer ${userDetails.token}`,
            },
          })
          toast.success(response?.data?.message)
          await refreshtypebot();
          closeModal()

        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to delete form.')
        }
      }
      
  return (
      <div className={styles.modal}>
         
         <div className={styles.modalContent}>
           <h2 className={styles.heading}>Are you sure you want to 
           delete this Form ?</h2>
          
           <div className={styles.buttons}>
             <button className={styles.doneButton} onClick={()=>deletetypebot(typebotId)} >Confirm</button>
             <div className={styles.divider}></div>
             <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
           </div>
         </div>
       </div>
  )
}

export default DeleteTypeBot