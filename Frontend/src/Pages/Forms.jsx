import React,{useState} from "react";
import { useTheme } from "../Contexts/ThemeContext";
import { 
  MessageSquare, Image, Video, Camera, Flag, 
  Type, Hash, Mail, Phone, Calendar, Star, 
  CheckSquare, X 
} from "lucide-react";
import { useParams } from "react-router-dom";
import styles from "../Styles/Forms.module.css";


function Forms() {
     const { formId, name } = useParams();
     const { isDarkMode, toggleTheme } = useTheme(); 
     const [formname, setformname] = useState(name);
     console.log(formId, name);
    

  return (
    <div className={styles.formContainer}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <input
            type="text"
            placeholder="Enter Form Name"
            value={formname}
            className={styles.formNameInput}
          />
          <div className={styles.headerControls}>
            <div className={styles.navigationButtons}>
              <button className={`${styles.navButton} ${styles.navButtonActive}`}>Flow</button>
              <button className={styles.navButton_res}>Response</button>
            </div>
            <div className={styles.headerActions}>
            <div className={styles.toggleContainer}>
               <span className={`${styles.theme_label} ${isDarkMode ? styles.textDark : styles.textLight}`}>
                    <p className={`${styles.light_mode} ${isDarkMode ? styles.dark : styles.light}`}>Light</p>
                        <label className={styles.switch}>
                             <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                             <span className={`${styles.slider} ${styles.round}`}></span>
                        </label>
                    <p className={`${styles.Dark_mode} ${isDarkMode ? styles.dark : styles.light}`}>Dark</p>
                 </span>
            </div>
            <button className={styles.shareButton}>Share</button>
            <button className={styles.saveButton}>Save</button>
            <button className={styles.closeButton}>
              <X size={24} />
            </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Left Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarSection}>
              <h2 className={styles.sectionTitle}>Bubbles</h2>
              <div className={styles.buttonGrid}>
                <button className={styles.itemButton}>
                  <MessageSquare size={20} className={styles.blueIcon} />
                  <span>Text</span>
                </button>
                <button className={styles.itemButton}>
                  <Image size={20} className={styles.blueIcon} />
                  <span>Image</span>
                </button>
                <button className={styles.itemButton}>
                  <Video size={20} className={styles.blueIcon} />
                  <span>Video</span>
                </button>
                <button className={styles.itemButton}>
                  <Camera size={20} className={styles.blueIcon} />
                  <span>GIF</span>
                </button>
              </div>
            </div>

            <div className={styles.sidebarSection}>
              <h2 className={styles.sectionTitle}>Inputs</h2>
              <div className={styles.buttonGrid}>
                <button className={styles.itemButton}>
                  <Type size={20} className={styles.orangeIcon} />
                  <span>Text</span>
                </button>
                <button className={styles.itemButton}>
                  <Hash size={20} className={styles.orangeIcon} />
                  <span>Number</span>
                </button>
                <button className={styles.itemButton}>
                  <Mail size={20} className={styles.orangeIcon} />
                  <span>Email</span>
                </button>
                <button className={styles.itemButton}>
                  <Phone size={20} className={styles.orangeIcon} />
                  <span>Phone</span>
                </button>
                <button className={styles.itemButton}>
                  <Calendar size={20} className={styles.orangeIcon} />
                  <span>Date</span>
                </button>
                <button className={styles.itemButton}>
                  <Star size={20} className={styles.orangeIcon} />
                  <span>Rating</span>
                </button>
                <button className={styles.itemButton}>
                  <CheckSquare size={20} className={styles.orangeIcon} />
                  <span>Buttons</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div className={styles.canvas}>
            <div className={styles.startIndicator}>
              <Flag size={20} />
              <span>Start</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forms;
