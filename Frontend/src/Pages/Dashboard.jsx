import React, { useState,useEffect,useRef,useContext } from 'react';
import { useTheme } from '../Contexts/ThemeContext'; 
import CreateFolder from '../Modals/CreateFolder';
import CreateTypeBot from '../Modals/CreateTypeBot';
import InviteModal from '../Modals/ShareDashboard';
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
  const [dashboardInitialized, setDashboardInitialized] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [foldermodal, setfoldermodal] = useState(false);
  const [deletefoldermodal, setdeletefoldermodal] = useState(false);
  const [createtypebotmodal,setcreatetypebotmodal] = useState(false);
  const [deletetypebotmodal,setdeletetypebotmodal] = useState(false)
  const [invitemodal,setinvitemodal] = useState(false)
  const [folders, setFolders] = useState([]); 
  const [forms, setforms] = useState();
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedTypeBotId, setSelectedTypeBotId] = useState(null)
  const [sharedDashboards,setSharedDashboards] = useState([])
  const [sharedDashboardID,setshareDashboardID] = useState()
  const [activeWorkspaceName, setActiveWorkspaceName] = useState(userDetails?.username || "Workspace");
  const [permission, setPermissions] = useState('edit'); 
  const [owner,setowner] = useState(true)
  const [loading,setlading] = useState(true)



  

 
  const handledashID = async (id, name) => {
    const selectedDashboard = sharedDashboards.find(dashboard => dashboard.id === id);
    setPermissions(selectedDashboard?.permission || 'edit');
    setshareDashboardID(id);
    setActiveWorkspaceName(name);
    setowner(false)
    setSelectedFolderId(null);
    setforms([]); 
    
   
    toggleDropdown();
     
  };
  
  const handleownerdash = async (id, name) => {
    setPermissions('edit');
    setshareDashboardID(null);
    setActiveWorkspaceName(name);
    getFolders();
    fetchTypeBot();
    toggleDropdown();
  }

 const {isLoggedIn,login,logout} = useContext(AuthContext)
 const navigate = useNavigate()

  const openfoldermodal = () => setfoldermodal(true); 
  const closefoldermodal = () => setfoldermodal(false); 
  

  const opendeletefoldermodal = () => setdeletefoldermodal(true); 
  const closedeletefoldermodal = () => setdeletefoldermodal(false); 
  

  const opentypeBotmodal = () => {
    if(permission === 'edit')
      {
        setcreatetypebotmodal(true)
      }else{toast.error("You can only view the dashboard. Editing is not allowed.")}
    };
  const closetypeBotmodal = () =>setcreatetypebotmodal(false);

  const opendeletetypebotmodal = () => setdeletetypebotmodal(true);
  const closedeletetypebotmodal = () =>setdeletetypebotmodal(false);

  const openinvitemodal = () => setinvitemodal(true);
  const closeinvitemodal = () => setinvitemodal(false);
  

  const handleFolderClick = async(folderId) => { 
      setSelectedFolderId(folderId);
      await  fetchTypeBot(folderId)
    
  };


const handleCreateFolderClick = () => {
  if (permission === 'view') {
    toast.error("You can only view the dashboard. Editing is not allowed.");
    return;
  }
  openfoldermodal(); 
};



  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
    
  };

  const handlelogout = () =>{
    logout()
    navigate('/')
  }

  const handleformclick = (formId,name) => {
    if(owner===true){
    navigate(`/forms/${formId}/${name}`)
    }else{
      toast.error("You are not the owner of this dashboard. You cannot access forms.")
    }
  }

  const handlesettingclick = () =>{
    if(owner===true){
      navigate('/settings')
     }else{
    toast.error("You are not the owner of this dashboard. You cannot access settings.")
    }
  }

  const createdashboard = async () => {
  
    try {
  
      const response = await axios.post(
        "https://final-evaluation-qbj9.onrender.com/api/v1/dashboard/createdashboard",
        { username: userDetails.username }, 
        {
          headers: {
            Authorization: `Bearer ${userDetails.token}`, 
          },
        }
      );
  
     
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server error. Please try again later.");
    }
  };



 

  const getshareddashboard = async() =>{
    try {
      const response = await axios.get('https://final-evaluation-qbj9.onrender.com/api/v1/dashboard/shareddashboardID',{
        headers: {
          Authorization: `Bearer ${userDetails.token}`, 
        },
      })
      if(response.status==200){
        const formattedDashboards = response.data.sharedWith.map(item => ({
          id: item.dashboard._id,
          name: item.dashboard.name,
          permission: item.permission
        }));

        setSharedDashboards(formattedDashboards);
        
      }
    } catch (error) {
      console.log("error while getting shared dashboard")
      toast.error(error.response?.data?.message)
    }
  }


  const getFolders = async () => {
    try {
      const response = await axios.get("https://final-evaluation-qbj9.onrender.com/api/v1/folder/getfolders", {
        params: { dashboardID: sharedDashboardID },
        headers: {
          Authorization: `Bearer ${userDetails.token}`, 
        },
      });
      if (response.data?.folders) {
        setFolders(response.data.folders);  
        setlading(false)
      }
    } catch (error) {
      console.error(error);
      // toast.error(error.response?.data?.message || "Failed to load folders.");
    }
  };
  

  const handleDeleteFolderClick = (folderId,e) => {
    // e.stopPropagation();
    if(permission === 'view'){    
      toast.error("You can only view the dashboard. Editing is not allowed.");
      return;
    }
    setSelectedFolderId(folderId); 
    opendeletefoldermodal(); 
  };

 
  const fetchTypeBot = async(folderId) =>{
      try {
        
       
        const params = {
          dashboardID: sharedDashboardID, 
          folderId: folderId || undefined, 
        };

        const response = await axios.get('https://final-evaluation-qbj9.onrender.com/api/v1/typebot/getTypeBot',
          {
            headers: {
              Authorization: `Bearer ${userDetails.token}`,
            },
            params,
          }
        )
        if(response.data){
          setforms(response.data || []);
          setlading(false)
        }
         

      } catch (error) {
        setforms([]);
        // toast.error(error.response?.data?.message || 'Failed to load forms');
      }
  }

  const handledeletetypebotclick = (typebotId) =>{
    if(permission === 'view'){
      toast.error("You can only view the dashboard. Editing is not allowed.");
      return;
    }
    setSelectedTypeBotId(typebotId)
    opendeletetypebotmodal()
  }

  

  useEffect(() => {
    const initializeDashboard = async () => {
      if (userDetails && !dashboardInitialized) {
        await createdashboard();
        await getshareddashboard();
        setDashboardInitialized(true); 
      }
      
  
      await getFolders();
      await fetchTypeBot(selectedFolderId);

      if (sharedDashboardID) {
        await getFolders(sharedDashboardID);
        await fetchTypeBot();
      }
    };

    initializeDashboard();
  }, [userDetails,sharedDashboardID]);
   

  return (
      <>
           <ToastContainer />
         <div className={`${styles.wrapper} ${isDarkMode ? styles.dark : styles.light}`}>
      <nav className={`${styles.navbar} ${isDarkMode ? styles.dark : styles.light}`}>
      <div className={`${styles.workspace_dropdown} ${isDarkMode ? styles.dark : styles.light}`}>
          <div className={`${styles.workspace_name} ${isDarkMode ? styles.textDark : styles.textLight}`} onClick={toggleDropdown}>
            <span className={`${styles.workspace_text} ${isDarkMode ? styles.textDark : styles.textLight}`}>
              {activeWorkspaceName}'s Workspace
            </span>
            {isDropdownOpen ? <IoIosArrowUp className={styles.arrow_icon} /> : <IoIosArrowDown className={styles.arrow_icon} />}
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdown_menu}>
              <div 
                className={`${styles.dropdown_item} ${isDarkMode ? styles.textDark : styles.textLight}`} 
                onClick={() => handleownerdash(null, userDetails.username)}
              >
                {userDetails.username}'s Workspace
              </div>
              {sharedDashboards.map(dashboard => (
                <div 
                  key={dashboard.id} 
                  className={`${styles.dropdown_item} ${isDarkMode ? styles.textDark : styles.textLight}`} 
                  onClick={() => handledashID(dashboard.id, dashboard.name)}
                >
                  {dashboard.name}'s Workspace 
                </div>
              ))}
              <div className={`${styles.dropdown_item} ${isDarkMode ? styles.textDark : styles.textLight}`} onClick={handlesettingclick}>Settings</div>
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
          <button className={`${styles.share_button} ${isDarkMode ? styles.dark : styles.light}`} onClick={openinvitemodal}>
            Share
          </button>
        </div>
      </nav>

      <div className={styles.folder_wrapper}>
          <div className={`${styles.create_folder} ${isDarkMode ? styles.dark : styles.light}`}>
            <FaFolderPlus className={styles.folder_icon} />
            <p  onClick={handleCreateFolderClick} >Create a folder</p>
          </div>
          

          <div className={styles.folders_list}>
            {folders.length > 0 ? (
              folders.map((folder) => (
                <div key={folder._id} className={`${styles.folder_item} ${
                  selectedFolderId === folder._id ? styles.active_folder : ""
                } ${isDarkMode ? styles.dark : styles.light}`} >
                   
                      <p onClick={() => handleFolderClick(folder._id)}>{folder.name} </p>
                      <RiDeleteBin6Line className={styles.delete_icon}  onClick={() => handleDeleteFolderClick(folder._id)} />
                   
                </div>
              ))
            ) : (
               loading ? <p>Loading...</p> : <p>No folders available.</p>
            )}
          </div>

      </div>

      {foldermodal   &&  permission === 'edit' && <CreateFolder closeModal={closefoldermodal} refreshFolders={getFolders} shareddashid={sharedDashboardID}/>}
      {deletefoldermodal &&  permission === 'edit'&& <DeleteFolder closeModal={closedeletefoldermodal} refreshFolders={getFolders} folderId={selectedFolderId} />}
      {createtypebotmodal && permission === 'edit' && <CreateTypeBot closemodal={closetypeBotmodal} refreshtypebot={() => fetchTypeBot(selectedFolderId)} folderId={selectedFolderId} shareddashid={sharedDashboardID}/>}
      {deletetypebotmodal && permission === 'edit' && <DeleteTypeBot closeModal={closedeletetypebotmodal}  refreshtypebot={() => fetchTypeBot(selectedFolderId)} typebotId={selectedTypeBotId}/>}
      {invitemodal && <InviteModal closeModal={closeinvitemodal} setshareddashboard={setSharedDashboards}/>}  

        <div className={styles.forms_wrapper}>
            <div className={styles.form_wrapper}>
            <div className={styles.Create_TypeBot}>
              <CreateFormbtn onClick={opentypeBotmodal} />
            </div>
                {forms?.length > 0 ? (
                  forms?.map((item) => (
                       <div className={styles.form_container}>
                         <div key={item._id} className={`${styles.form} ${isDarkMode ? styles.dark : styles.light}`} onClick={()=>handleformclick(item._id,item.name)}>
                           <p>{item.name}</p> 
                         </div>
                         <RiDeleteBin6Line className={styles.form_delete_icon} onClick={()=>handledeletetypebotclick(item._id)}/>
                       </div>
                  ))
                ) : (
                  loading ? <p>Loading...</p> : <p>No forms available.</p>
                )}
                
            </div>


        </div>
      

    </div>
      </>
  );
}

export default Dashboard;