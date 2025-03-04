import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from '../Styles/FillForm.module.css';
import { IoSend } from "react-icons/io5";
import axios from "axios";

const INPUT_TYPES = {
  'text-input': { type: 'text', placeholder: 'Enter text' },
  'email': { type: 'email', placeholder: 'Enter email' },
  'number': { type: 'number', placeholder: 'Enter number' },
  'date': { type: 'date', placeholder: 'Select date' },
  'rating': { type: 'rating', placeholder: 'Select rating' },
  'phone': { type: 'tel', placeholder: 'Enter phone number' },
  'button': { type: 'button', placeholder: 'Submit' }
};

function FillForm() {
  const { formId } = useParams();
  const [messages, setMessages] = useState([]);
  const [userResponses, setUserResponses] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [inputErrors, setInputErrors] = useState({});
  const [selectedRating, setSelectedRating] = useState(null);
  const [userDetails, setUserDetails] = useState(
    JSON.parse(localStorage.getItem("UserDetails")) || null
  );
  const [hasStarted, setHasStarted] = useState(false);
  const [formStage, setFormStage] = useState('name'); // 'name', 'email', or 'main'
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: ''
  });
 

  useEffect(() => {
    const updateViewCount = async () => {
      try {
        await axios.put(
          `https://final-evaluation-qbj9.onrender.com/api/v1/responses/increment-view-count/${formId}`,
          {},
        );
        console.log("View count updated");
      } catch (error) {
        console.error("Error updating view count:", error);
      }
    };

    updateViewCount();
  }, [formId]);


  useEffect(() => {
    const fetchFormContent = async () => {
      try {
        const res = await axios.get(
          `https://final-evaluation-qbj9.onrender.com/api/v1/typebot/get-form-content/${formId}`,
          {
            headers: {
              Authorization: `Bearer ${userDetails?.token}`,
            },
          }
        );
        setMessages(res.data.content);
        toast.success("Form content fetched successfully!");
      } catch (error) {
        console.error("Error fetching form content:", error);
        toast.error("Error fetching form content!");
      }
    };

    fetchFormContent();
  }, [formId, userDetails?.token]);


  const updateStartCount = async () => {
    if (!hasStarted) {
      setHasStarted(true);
      try {
        await axios.put(
          `https://final-evaluation-qbj9.onrender.com/api/v1/responses/increment-start-count/${formId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userDetails?.token}`,
            },
          }
        );
        console.log("Start count updated");
      } catch (error) {
        console.error("Error updating start count:", error);
      }
    }
  };


  const validateInput = (type, value) => {
     if (!value.trim() && type !== 'button') return null
    
    switch(type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        break;
      case 'phone':
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) return 'Invalid phone number (10 digits required)';
        break;
      case 'number':
        if (isNaN(value)) return 'Must be a number';
        break;
    }
    return null;
  };

  const handleInitialFieldSubmit = () => {
    if (formStage === 'name') {
      if (!inputValue.trim()) {
        toast.error('Please enter your name');
        return;
      }
      setUserInfo(prev => ({ ...prev, name: inputValue }));
      setFormStage('email');
      setInputValue('');
    } else if (formStage === 'email') {
      const emailError = validateInput('email', inputValue);
      if (emailError) {
        toast.error(emailError);
        return;
      }
      setUserInfo(prev => ({ ...prev, email: inputValue }));
      setFormStage('main');
      setInputValue('');
    }
  };

  const renderInitialFields = () => {
    if (formStage === 'main') return null;

    const isNameStage = formStage === 'name';
    const placeholder = isNameStage ? 'Enter your name' : 'Enter your email';
    const inputType = isNameStage ? 'text' : 'email';

    return (
      <div className={styles.messagesContainer}>
        {userInfo.name && (
          <div className={styles.messageRight}>
            <div className={styles.messageBubble}>{userInfo.name}</div>
          </div>
        )}
        {formStage === 'email' && (
          <div className={styles.messageLeft}>
            <img src="/Chatbot_img.png" alt="chat" className={styles.chatbotimg}/>
            <div className={styles.messageBubble}>Please enter your email</div>
          </div>
        )}
        {formStage !== 'main' && (
          <div className={styles.inputContainer}>
            <div className={styles.inputWrapper}>
              <input
                type={inputType}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={styles.input}
                placeholder={placeholder}
              />
              <button 
                className={styles.button}
                onClick={handleInitialFieldSubmit}
              >
                <IoSend className={styles.send_btn}/>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const findFirstInput = () => {
    return messages.findIndex(msg => msg.type === 'input');
  };

  const findNextInputIndex = () => {
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].type === 'input' && !userResponses[i]) {
        return i;
      }
    }
    return null;
  };

  const formatResponsesForSubmission = () => {
    const formattedResponses = [
      {
        label: 'User Name',
        type: 'input',
        data: userInfo.name
      },
      {
        label: 'User Email',
        type: 'input',
        data: userInfo.email
      },
      ...messages.map((message, index) => {
        if (message.type === 'text') {
          return {
            label: message.label || `Text ${index + 1}`,
            type: 'text',
            data: message.data
          };
        }
        if (message.type === 'image') {
          return {
            label: message.label || `Image ${index + 1}`,
            type: 'image',
            data: message.data
          };
        }
        if (message.type === 'input' && message.data !== 'button') {
          const responseData = userResponses[index] === "Skipped" ? "" : userResponses[index];
          return {
            label: message.label || `Input ${index + 1}`,
            type: 'input',
            data: responseData
          };
        }
        return null;
      }).filter(response => response !== null)
    ];

    return formattedResponses;
  };

  const handleSubmitForm = async () => {
    try {
        const formattedResponses = formatResponsesForSubmission();
        const requestData = {
          responses: formattedResponses,
      };

        const response = await axios.post(
            `https://final-evaluation-qbj9.onrender.com/api/v1/responses/add-form-response/${formId}`,
            requestData,
            {
                headers: {
                    Authorization: `Bearer ${userDetails?.token}`,
                },
            }
        );

        
        toast.success("Form submitted successfully!");
    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error.response?.data?.error || "Error submitting form!");
    }
};

  const handleSend = () => {
    const currentInputIndex = findNextInputIndex();
    if (currentInputIndex === null) return;

    const currentInput = messages[currentInputIndex];
    const inputType = currentInput.data;

    if (!hasStarted && formStage === 'main') {
      updateStartCount();
    }

    if (inputType === 'button') {
      handleSubmitForm();
      setUserResponses(prev => ({
        ...prev,
        [currentInputIndex]: 'Submitted'
      }));
      return;
    }

    const error = validateInput(inputType, inputValue);
    if (error) {
      setInputErrors(prev => ({ ...prev, [currentInputIndex]: error }));
      toast.error(error);
      return;
    }

    setUserResponses(prev => ({
      ...prev,
      [currentInputIndex]: inputValue || 'Skipped'
    }));
    setInputValue('');
    setInputErrors(prev => ({ ...prev, [currentInputIndex]: null }));

    const nextIndex = findNextInputIndex();
    if (nextIndex === null) {
      handleSubmitForm();
    }
   
  };

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
    setInputValue(rating.toString());
  };

  const renderRating = () => (
    <div className={styles.ratingContainer}>
      <div className={styles.rating_wrapper}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <p
            key={rating}
            onClick={() => handleRatingSelect(rating)}
            className={`${styles.ratingButton} ${
              selectedRating === rating ? styles.ratingButtonSelected : ''
            }`}
          >
            {rating}
          </p>
        ))}
      </div>
      <button 
        className={styles.button}
        onClick={handleSend}
        disabled={!selectedRating}
      >
        <IoSend className={styles.send_btn}/>
      </button>
    </div>
  );

  const renderInputField = (inputType, currentIndex) => {
    if (inputType === 'rating') {
      return renderRating();
    }

    if (inputType === 'button') {
      return (
        <button 
          className={styles.submitButton}
          onClick={handleSend}
        >
          Submit
        </button>
      );
    }

    const inputConfig = INPUT_TYPES[inputType] || INPUT_TYPES['text-input'];

    return (
      <>
        <div className={styles.inputWrapper}> 
          <input
            type={inputConfig.type}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.input}
            placeholder={inputConfig.placeholder}
          />
          <button 
            className={styles.button}
            onClick={handleSend}
          >
            <IoSend className={styles.send_btn}/>
          </button>
        </div>
        {inputErrors[currentIndex] && (
          <div className={styles.error}>{inputErrors[currentIndex]}</div>
        )}
      </>
    );
  };

  const shouldShowMessage = (index) => {
    const firstInputIndex = findFirstInput();
    const nextInputIndex = findNextInputIndex();

    if (index < firstInputIndex) return true;
    if (nextInputIndex === null) return true;
    return index <= nextInputIndex;
  };

  const renderMessage = (message, index) => {
    if (!shouldShowMessage(index)) return null;

    if (message.type === 'text') {
      return (
        <div className={styles.messageLeft}>
           <img src="/Chatbot_img.png" alt="chat"  className={styles.chatbotimg}/>
          <div className={styles.messageBubble}>{message.data}</div>
        </div>
      );
    }

    if (message.type === 'image') {
      return (
        <div className={styles.messageLeft}>
          <img src={message.data} alt="Chat" className={styles.messageImage} />
        </div>
      );
    }

    if (message.type === 'input') {
      if (userResponses[index]) {
        return (
          <div className={styles.messageRight}>
            <div className={styles.messageBubble}>{userResponses[index]}</div>
          </div>
        );
      }

      const currentInputIndex = findNextInputIndex();
      if (index === currentInputIndex) {
        return (
          <div className={styles.inputContainer}>
            {renderInputField(message.data, index)}
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.chatContainer}>
        {formStage === 'name' && (
          <div className={styles.messageLeft}>
            <img src="/Chatbot_img.png" alt="chat" className={styles.chatbotimg}/>
            <div className={styles.messageBubble}>Please enter your name</div>
          </div>
        )}
        {renderInitialFields()}
        {formStage === 'main' && (
          <div className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div key={index} className={styles.messageWrapper}>
                {renderMessage(message, index)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FillForm;