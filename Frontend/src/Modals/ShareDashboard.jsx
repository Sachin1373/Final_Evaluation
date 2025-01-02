import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { IoMdArrowDropdown } from "react-icons/io";
import styles from '../Styles/ShareDashboard.module.css';


const InviteModal = ({ closeModal,setshareddashboard }) => {
  const [email, setEmail] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("UserDetails")) || null);
  const [permission, setPermission] = useState('view'); 
  const [link, setLink] = useState('');

 

  const handleSendInvite = async() => {
    if (!email) {
        toast.error("Please enter an email address!");
        return;
    }

    try {
        const response = await axios.post('https://final-evaluation-qbj9.onrender.com/api/v1/dashboard/sharedashboard', 
            { email, permission },
            {
              headers: {
                Authorization: `Bearer ${userDetails.token}`,
              },
            }
          );

          if (response.status === 200) {
            toast.success("Dashboard shared successfully!");
            console.log(setshareddashboard(response.data.shareddashboarId))
            closeModal(); 
          }
    
    } catch (error) {
        console.error("Error sharing dashboard:", error);
        toast.error(
            error.response?.data?.message || "Failed to share dashboard.");
        }

  };

  const generateLink = async () => {
    try {
        const response = await axios.post('https://final-evaluation-qbj9.onrender.com/api/v1/dashboard/share-link',
          { permission },
          {
            headers: {
              Authorization: `Bearer ${userDetails.token}`,
            },
          }
        );
        setLink(response.data.link);

        navigator.clipboard.writeText(response.data.link);
        alert('Link copied to clipboard!');
    } catch (error) {
        console.error('Error generating link', error);
        alert('Failed to generate link');
    }
};

  const handleCopyLink = () => {
    generateLink ();
  };

  const togglePermission = (newPermission) => {
    setPermission(newPermission); 
    setIsEditOpen(false); 
  };

  return (
    <div className={styles.modalOverlay}>
         <ToastContainer />
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2>Invite by Email</h2>
          <div className={styles.headerRight}>
            <div className={styles.editDropdown}>
              <button 
                className={styles.editButton} 
                onClick={() => setIsEditOpen(!isEditOpen)}
              >
                {permission.charAt(0).toUpperCase() + permission.slice(1)} <IoMdArrowDropdown className={styles.drop_icon} />
              </button>
              {isEditOpen && (
                <div className={styles.dropdownMenu}>
                  <div 
                    className={styles.dropdownItem} 
                    onClick={() => togglePermission('edit')}
                  >
                    Edit
                  </div>
                  <div 
                    className={styles.dropdownItem} 
                    onClick={() => togglePermission('view')}
                  >
                    View
                  </div>
                </div>
              )}
            </div>
            <button 
              className={styles.closeButton} 
              onClick={closeModal}
            >
              <RxCross2 />
            </button>
          </div>
        </div>

        <div className={styles.emailSection}>
          <input
            type="email"
            placeholder="Enter email id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.emailInput}
          />
          <button 
            className={styles.sendButton}
            onClick={handleSendInvite}
          >
            Send Invite
          </button>
        </div>

        <div className={styles.linkSection}>
          <h2>Invite by link</h2>
          <button 
            className={styles.copyLinkButton}
            onClick={handleCopyLink}
          >
            Copy link
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
