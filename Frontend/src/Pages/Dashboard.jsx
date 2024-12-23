import React, { useState,useEffect,useRef,useContext } from 'react';
import { useTheme } from '../Contexts/ThemeContext'; 
import CreateFolder from '../Modals/CreateFolder';
import CreateTypeBot from '../Modals/CreateTypeBot';
import DeleteTypeBot from '../Modals/DeleteTypeBot';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import CreateFormbtn from '../Components/CreateFormbtn';
import { AuthContext } from '../Contexts/AuthContext';
import DeleteFolder from '../Modals/DeleteFolder';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { FaFolderPlus } from "react-icons/fa";
import styles from "../Styles/Dashboard.module.css";

function Dashboard() {
  const { isDarkMode, toggleTheme } = useTheme(); 
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("UserDetails")) || null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [foldermodal, setfoldermodal] = useState(false);
  const [deletefoldermodal, setdeletefoldermodal] = useState(false);
  const [createtypebotmodal,setcreatetypebotmodal] = useState(false);
  const [deletetypebotmodal,setdeletetypebotmodal] = useState(false)
  const [folders, setFolders] = useState([]); 
  const [forms, setforms] = useState();
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedTypeBotId, setSelectedTypeBotId] = useState(null)

 const {isLoggedIn,login,logout} = useContext(AuthContext)
 const navigate = useNavigate()

  const openfoldermodal = () => setfoldermodal(true); 
  const closefoldermodal = () => setfoldermodal(false); 
  

  const opendeletefoldermodal = () => setdeletefoldermodal(true); 
  const closedeletefoldermodal = () => setdeletefoldermodal(false); 
  

  const opentypeBotmodal = () => setcreatetypebotmodal(true);
  const closetypeBotmodal = () =>setcreatetypebotmodal(false);

  const opendeletetypebotmodal = () => setdeletetypebotmodal(true);
  const closedeletetypebotmodal = () =>setdeletetypebotmodal(false)
  

  const handleFolderClick = (folderId) => {
    
      setSelectedFolderId(folderId);
    
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handlelogout = () =>{
    logout()
    navigate('/')
  }

  const createdashboard = async () => {
    try {
  
      // Make API request
      const response = await axios.post(
        "http://localhost:8000/api/v1/dashboard/createdashboard",
        { username: userDetails.Username }, // Send username in the body
        {
          headers: {
            Authorization: `Bearer ${userDetails.token}`, // Include token in headers
          },
        }
      );
  
     
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server error. Please try again later.");
    }
  };


  const getFolders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/folder/getfolders", {
        headers: {
          Authorization: `Bearer ${userDetails.token}`, // Include token in headers
        },
      });
      if (response.data?.folders) {
        setFolders(response.data.folders);  // Set folders in state
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load folders.");
    }
  };
  

  const handleDeleteFolderClick = (folderId) => {
    setSelectedFolderId(folderId); // Set the folder ID when delete is clicked
    opendeletefoldermodal(); // Open the modal
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/folder/deletefolder/${folderId}`, {
        headers: {
          Authorization: `Bearer ${userDetails.token}`,
        },
      });
      toast.success(response.data.message);
      getFolders(); 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete folder.");
    }
  };
  
  const createTypeBot = async (name) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/typebot/createtypebot",
        { name, folderId: selectedFolderId },
        {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        }
      );
      toast.success(response.data.message);
      closetypeBotmodal();
      fetchTypeBot(selectedFolderId)
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create TypeBot.");
    }
  };

  const fetchTypeBot = async(folderId) =>{
      try {
        
        const params = folderId ? { folderId } : {};

        const response = await axios.get('http://localhost:8000/api/v1/typebot/getTypeBot',
          {
            headers: {
              Authorization: `Bearer ${userDetails.token}`,
            },
            params,
          }
        )
      
        setforms(response.data || []);

      } catch (error) {
        setforms([]);
        toast.error(error.response?.data?.message || 'Failed to load forms');
      }
  }

  const handledeletetypebotclick = (typebotId) =>{
    setSelectedTypeBotId(typebotId)
    opendeletetypebotmodal()
  }

  const deleteform = async(TypeBotId) =>{
    try {
      const response = axios.delete(`http://localhost:8000/api/v1/typebot/deleteTypeBot?typeBotId=${TypeBotId}`,{
        headers: {
          Authorization: `Bearer ${userDetails.token}`,
        },
      })
      toast.success(response?.data?.message)
      fetchTypeBot(selectedFolderId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete form.')
    }
  }

  useEffect(() => {
    // Fetch folders after user details are loaded
    if (userDetails) {
      getFolders();  
      fetchTypeBot(selectedFolderId)
    }
    if(selectedFolderId){
      fetchTypeBot(selectedFolderId);
    }
  
  }, [userDetails, selectedFolderId]);  

 
  
  
  

  return (
      <>
           <ToastContainer />
         <div className={`${styles.wrapper} ${isDarkMode ? styles.dark : styles.light}`}>
      <nav className={`${styles.navbar} ${isDarkMode ? styles.dark : styles.light}`}>
        <div className={`${styles.workspace_dropdown} ${isDarkMode ? styles.dark : styles.light}`}>
          <div className={`${styles.workspace_name} ${isDarkMode ? styles.textDark : styles.textLight}`} onClick={toggleDropdown}>
            <span className={`${styles.workspace_text} ${isDarkMode ? styles.textDark : styles.textLight}`}>
              {userDetails?.Username} Workspace
            </span>
            {isDropdownOpen ? <IoIosArrowUp className={styles.arrow_icon} /> : <IoIosArrowDown className={styles.arrow_icon} />}
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdown_menu}>
              <div className={`${styles.dropdown_item} ${isDarkMode ? styles.textDark : styles.textLight}`}>Shared Dashboard 1</div>
              <div className={`${styles.dropdown_item} ${isDarkMode ? styles.textDark : styles.textLight}`} onClick={()=> navigate('/settings')}>Settings</div>
              <div className={`${styles.dropdown_item} ${isDarkMode ? styles.textDark : styles.textLight}`} style={{ color: 'orange' }} onClick={handlelogout}>Logout</div>
            </div>
          )}
        </div>

        <div className={styles.right_section}>
          <span className={`${styles.theme_label} ${isDarkMode ? styles.textDark : styles.textLight}`}>
            <p className={`${styles.light_mode} ${isDarkMode ? styles.dark : styles.light}`}>Light</p>
            <label className={styles.switch}>
              <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
              <span className={`${styles.slider} ${styles.round}`}></span>
            </label>
            <p className={`${styles.Dark_mode} ${isDarkMode ? styles.dark : styles.light}`}>Dark</p>
          </span>
          <button className={`${styles.share_button} ${isDarkMode ? styles.dark : styles.light}`}>
            Share
          </button>
        </div>
      </nav>

      <div className={styles.folder_wrapper}>
          <div className={`${styles.create_folder} ${isDarkMode ? styles.dark : styles.light}`}>
            <FaFolderPlus className={styles.folder_icon} />
            <p onClick={openfoldermodal} >Create a folder</p>
          </div>
          

          <div className={styles.folders_list}>
            {folders.length > 0 ? (
              folders.map((folder) => (
                <div key={folder._id} className={`${styles.folder_item} ${
                  selectedFolderId === folder._id ? styles.active_folder : ""
                } ${isDarkMode ? styles.dark : styles.light}`} onClick={() => handleFolderClick(folder._id)}>
                   
                      <p>{folder.name} </p>
                      <RiDeleteBin6Line className={styles.delete_icon}  onClick={() => handleDeleteFolderClick(folder._id)} />
                   
                </div>
              ))
            ) : (
              <p>No folders available.</p>
            )}
          </div>

      </div>

      {foldermodal && <CreateFolder closeModal={closefoldermodal} refreshFolders={getFolders}/>}
      {deletefoldermodal && <DeleteFolder closeModal={closedeletefoldermodal} handleDeleteFolder={handleDeleteFolder} folderId={selectedFolderId} />}
      {createtypebotmodal && <CreateTypeBot closemodal={closetypeBotmodal} createTypeBot={createTypeBot}/>}
      {deletetypebotmodal && <DeleteTypeBot closeModal={closedeletetypebotmodal} deleteform={deleteform} typebot={selectedTypeBotId}/>}

        <div className={styles.forms_wrapper}>
            <div className={styles.Create_TypeBot}>
              <CreateFormbtn onClick={opentypeBotmodal} />
            </div>
          
            <div className={styles.form_wrapper}>
                {forms?.length > 0 ? (
                  forms?.map((item) => (
                       <div key={item._id} className={`${styles.form} ${isDarkMode ? styles.dark : styles.light}`}>
                         <p>{item.name}</p> 
                         <RiDeleteBin6Line className={styles.form_delete_icon} onClick={()=>handledeletetypebotclick(item._id)}/>
                      </div>
                  ))
                ) : (
                  <p>No forms available.</p> // Optional message if no forms
                )}
                
            </div>


        </div>
      

    </div>
      </>
  );
}

export default Dashboard;
