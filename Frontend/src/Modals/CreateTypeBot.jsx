import React,{useState} from 'react'
import { useTheme } from '../Contexts/ThemeContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import styles from "../Styles/CreateFolder.module.css"

function CreateTypeBot({closemodal,refreshtypebot,folderId}) {

  const [typeBotName, setTypeBotName] = useState("");
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("UserDetails")) || null);
 
  const createTypeBot = async () => {
    try {
      const response = await axios.post(
        "https://final-evaluation-qbj9.onrender.com/api/v1/typebot/createtypebot",
        { name : typeBotName, folderId },
        {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        }
      );
      toast.success(response.data.message);
      closemodal();
      await refreshtypebot()
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create TypeBot.");
    }
  };
      

    const handleFolderNameChange = (e) => {
        setTypeBotName(e.target.value);
    };

    const handleCancel = () => {
        closemodal(); 
    };
    
  return (
    <div className={styles.modal}>
   <div className={styles.modalContent}>
     <h2 className={styles.heading}>Create New typeBot</h2>
     <input
       type="text"
       className={styles.folderInput}
       value={typeBotName}
       onChange={handleFolderNameChange}
       placeholder="Enter folder name"
     />
     <div className={styles.buttons}>
       <button className={styles.doneButton} onClick={createTypeBot}>Done</button>
       <div className={styles.divider}></div>
       <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
     </div>
   </div>
 </div>
  )
}

export default CreateTypeBot