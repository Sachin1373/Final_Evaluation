import React,{useState} from 'react'
import { useTheme } from '../Contexts/ThemeContext';
import styles from "../Styles/CreateFolder.module.css"
function CreateTypeBot({closemodal,createTypeBot}) {

  const [typeBotName, setTypeBotName] = useState("");

  const handleDone = () => {
    if (typeBotName.trim()) {
      createTypeBot(typeBotName);
    } else {
      alert("TypeBot name cannot be empty.");
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
       <button className={styles.doneButton} onClick={handleDone}>Done</button>
       <div className={styles.divider}></div>
       <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
     </div>
   </div>
 </div>
  )
}

export default CreateTypeBot