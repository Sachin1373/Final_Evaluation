import React, { useState, useEffect } from "react";
import { useTheme } from "../Contexts/ThemeContext";
import { FiMessageSquare } from "react-icons/fi";
import { MessageSquare, Image, Video, Camera, Flag, Type, Hash, Mail, Phone, Calendar, Star, CheckSquare, X, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import inputItems from "../Constants/inputItems.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bubbleItems from "../Constants/bubbleItems.js";
import styles from "../Styles/Forms.module.css";

function Forms() {
  const { formId, name } = useParams();
  const { isDarkMode, toggleTheme } = useTheme();
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("UserDetails")) || null);
  const [formname, setformname] = useState(name);
  const [flowItems, setFlowItems] = useState([]);
  const [content, setContent] = useState([]);
  const [isContentReady, setIsContentReady] = useState(false);
  const [elementCounts, setElementCounts] = useState({});

  const navigate = useNavigate();

  const handleResponse = (formId) => {
    navigate(`/responses/${formId}/${name}`);
  };

  const handleclosebtn = () => {
    navigate("/dashboard");
  };

  const generateItemLabel = (item, count) => {
    const baseLabel = item.type === 'input' ? `Input ${item.label}` : item.label;
    return `${baseLabel} ${count}`;
  };

  const handleAddItem = (item) => {
    const isButtonPresent = flowItems.some((flowItem) => flowItem.type === 'button');

    if (isButtonPresent) {
      toast.info("You've reached the end of your form. Save or share your form now!");
      return; // Prevent adding any new items
    }

    const newCount = (elementCounts[item.id] || 0) + 1;
    
    setElementCounts(prevCounts => ({
      ...prevCounts,
      [item.id]: newCount
    }));

    const newItem = {
      ...item,
      uniqueId: `${item.id}-${Date.now()}`,
      hint: item.type === 'input' ? 'Hint: User will input a text on his form' : '',
      userInput: '',
      imgLink: '',
      displayLabel: generateItemLabel(item, newCount)
    };

    setFlowItems(prevItems => [...prevItems, newItem]);
  };

  const handleRemoveItem = (uniqueId) => {
    const removedItem = flowItems.find((item) => item.uniqueId === uniqueId);
    if (removedItem) {
      setElementCounts(prevCounts => ({
        ...prevCounts,
        [removedItem.id]: prevCounts[removedItem.id] - 1
      }));

      setFlowItems(prevItems => {
        const remainingItems = prevItems.filter(item => item.uniqueId !== uniqueId);
        return remainingItems.map(item => {
          if (item.id === removedItem.id) {
            const itemsOfType = remainingItems.filter(i => i.id === item.id);
            const itemIndex = itemsOfType.indexOf(item);
            return {
              ...item,
              displayLabel: generateItemLabel(item, itemIndex + 1)
            };
          }
          return item;
        });
      });
    }
  };

  const handleShare = () => {
    const baseUrl = "https://final-evaluation-ebon.vercel.app";
    const shareableLink = `${baseUrl}/fill-form/${formId}`;
    navigator.clipboard.writeText(shareableLink);
    toast.success("Shareable link copied to clipboard!");
  };

  const handleInputChange = (uniqueId, value, field = 'userInput') => {
    setFlowItems(prevItems =>
      prevItems.map(item =>
        item.uniqueId === uniqueId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = async () => {
    const dataToSave = flowItems.map(item => {
      if (item.type === 'bubble') {
        switch (item.id) {
          case 'text':
            return { 
              type: 'text', 
              data: item.userInput || '',
              count: elementCounts[item.id] || 0,
              label: item.displayLabel
            };
          case 'image':
            return { 
              type: 'image', 
              data: item.userInput || '',
              count: elementCounts[item.id] || 0,
              label: item.displayLabel
            };
          case 'video':
          case 'gif':
            return null;
          default:
            return null;
        }
      } else if (item.type === 'input') {
        return { 
          type: 'input', 
          data: item.id,
          count: elementCounts[item.id] || 0,
          label: item.displayLabel
        };
      }
      return null;
    }).filter(item => item !== null);
    
    setContent(dataToSave);
    setIsContentReady(true);
    console.log('Saving data:', dataToSave);
  };

  const updateContent = async () => {
    try {
      const res = await axios.put(
        `https://final-evaluation-qbj9.onrender.com/api/v1/typebot/update-form/${formId}`, 
        { content },
        {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success("Form content saved successfully!");
      } else {
        toast.error("Failed to save form content. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to save form. Please try again.", error.message);
    }
  };

  useEffect(() => {
    if (isContentReady) {
      updateContent();
      setIsContentReady(false);
    }
  }, [content, isContentReady]);

  return (
    <div className={`${styles.formContainer} ${isDarkMode ? styles.dark : styles.light}`}>
      <ToastContainer />
      <div className={`${styles.wrapper} ${isDarkMode ? styles.dark : styles.light}`}>
        <div className={`${styles.header} ${isDarkMode ? styles.dark : styles.light}`}>
          <input
            type="text"
            placeholder="Enter Form Name"
            value={formname}
            className={`${styles.formNameInput} ${isDarkMode ? styles.dark : styles.light}`}
          />
          <div className={`${styles.headerControls} ${isDarkMode ? styles.dark : styles.light}`}>
            <div className={`${styles.navigationButtons} ${isDarkMode ? styles.dark : styles.light}`}>
              <button className={`${styles.navButton} ${styles.navButtonActive} ${isDarkMode ? styles.dark : styles.light}`}>
                Flow
              </button>
              <button 
                className={`${styles.navButton_res} ${isDarkMode ? styles.dark : styles.light}`} 
                onClick={() => handleResponse(formId)}
              >
                Response
              </button>
            </div>
            <div className={`${styles.headerActions} ${isDarkMode ? styles.dark : styles.light}`}>
              <div className={`${styles.toggleContainer} ${isDarkMode ? styles.dark : styles.light}`}>
                <span className={`${styles.theme_label} ${isDarkMode ? styles.textDark : styles.textLight}`}>
                  <p className={`${styles.light_mode} ${isDarkMode ? styles.dark : styles.light}`}>Light</p>
                  <label className={styles.switch}>
                    <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                    <span className={`${styles.slider} ${styles.round}`}></span>
                  </label>
                  <p className={`${styles.Dark_mode} ${isDarkMode ? styles.dark : styles.light}`}>Dark</p>
                </span>
              </div>
              <button 
                className={`${styles.shareButton} ${isDarkMode ? styles.dark : styles.light}`} 
                onClick={handleShare}
              >
                Share
              </button>
              <button 
                className={`${styles.saveButton} ${isDarkMode ? styles.dark : styles.light}`} 
                onClick={handleSave}
              >
                Save
              </button>
              <button className={styles.closeButton}>
                <X size={24} onClick={handleclosebtn} />
              </button>
            </div>
          </div>
        </div>

        <div className={`${styles.mainContent} ${isDarkMode ? styles.dark : styles.light}`}>
          <div className={`${styles.sidebar} ${isDarkMode ? styles.dark : styles.light}`}>
            <div className={`${styles.sidebarSection} ${isDarkMode ? styles.dark : styles.light}`}>
              <h2 className={`${styles.sectionTitle} ${isDarkMode ? styles.dark : styles.light}`}>
                Bubbles
              </h2>
              <div className={`${styles.buttonGrid} ${isDarkMode ? styles.dark : styles.light}`}>
                {bubbleItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className={`${styles.itemButton} ${isDarkMode ? styles.dark : styles.light}`}
                  >
                    <item.icon size={20} className={styles.blueIcon} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`${styles.sidebarSection} ${isDarkMode ? styles.dark : styles.light}`}>
              <h2 className={`${styles.sectionTitle} ${isDarkMode ? styles.dark : styles.light}`}>
                Inputs
              </h2>
              <div className={`${styles.buttonGrid} ${isDarkMode ? styles.dark : styles.light}`}>
                {inputItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className={`${styles.itemButton} ${isDarkMode ? styles.dark : styles.light}`}
                  >
                    <item.icon size={20} className={styles.orangeIcon} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`${styles.canvas} ${isDarkMode ? styles.dark : styles.light}`}>
            <div className={`${styles.startIndicator} ${isDarkMode ? styles.dark : styles.light}`}>
              <img src={isDarkMode ? "/flag.png" : "/flag1.png"} alt="flag" />
              <span>Start</span>
            </div>

            {flowItems.map((item) => (
              <div
                key={item.uniqueId}
                className={`${styles.flowItem} ${isDarkMode ? styles.dark : styles.light}`}
              >
                <div className={styles.flowItemHeader}>
                  <span>{item.displayLabel}</span>
                  <button
                    onClick={() => handleRemoveItem(item.uniqueId)}
                    className={styles.removeButton}
                  >
                    <Trash2 size={16} className={styles.trash_icon} />
                  </button>
                </div>
                {item.hint && (
                  <div className={styles.flowItemHint}>
                    {item.hint}
                  </div>
                )}
                <div className={styles.flowItemContent}>
                  {item.type === 'input' ? (
                    ""
                  ) : (
                    <div className={styles.flowItemInputContainer}>
                      {item.id === 'text' && <FiMessageSquare className={styles.message_icon} />}
                      {item.id === 'image' && <Image className={styles.message_icon} />}
                      <input
                        type="text"
                        placeholder={
                          item.id === 'text' 
                            ? "Click here to edit" 
                            : item.id === 'image'
                              ? "Enter image URL"
                              : "Click to add link"
                        }
                        value={item.userInput || ''}
                        onChange={(e) => handleInputChange(item.uniqueId, e.target.value)}
                        className={`${styles.flowItemInput} ${isDarkMode ? styles.dark : styles.light}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forms;