import React from 'react'
import { FaPlus } from "react-icons/fa6";
import { useTheme } from '../Contexts/ThemeContext'; 
import styles from "../Styles/CreateFormbtn.module.css"
function CreateFormbtn() {
     const { isDarkMode } = useTheme(); 
  return (
    <>
       <div className={styles.create_from_btn}>
          <div><FaPlus className={`${styles.plus_icon} ${isDarkMode ? styles.dark : styles.light}`} /></div>
          <p className={`${styles.create_bot} ${isDarkMode ? styles.dark : styles.light}`}>Create a typebot</p>
       </div>
    </>
  )
}

export default CreateFormbtn