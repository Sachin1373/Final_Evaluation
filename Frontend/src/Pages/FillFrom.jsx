import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Styles/FillForm.module.css";
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
  const [userDetails, setUserDetails] = useState(
    JSON.parse(localStorage.getItem("UserDetails")) || null
  );

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

  const validateInput = (type, value) => {
    if (!value.trim()) return 'This field is required';
    
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

  const handleSubmitForm = async () => {
    // try {
    //   await axios.post(
    //     `https://final-evaluation-qbj9.onrender.com/api/v1/typebot/submit-form/${formId}`,
    //     { responses: userResponses },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${userDetails?.token}`,
    //       },
    //     }
    //   );
    //   toast.success("Form submitted successfully!");
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    //   toast.error("Error submitting form!");
    // }

    console.log('User responses:', userResponses);
  };

  const handleSend = () => {
    const currentInputIndex = findNextInputIndex();
    if (currentInputIndex === null) return;

    const currentInput = messages[currentInputIndex];
    const inputType = currentInput.data;

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
      [currentInputIndex]: inputValue
    }));
    setInputValue('');
    setInputErrors(prev => ({ ...prev, [currentInputIndex]: null }));
  };

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
    setInputValue(rating.toString());
  };

  const renderRating = () => (
    <div className={styles.ratingContainer}>
      <div className={styles.rating_wrapper}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => handleRatingSelect(rating)}
            className={`${styles.ratingButton} ${
              selectedRating === rating ? styles.ratingButtonSelected : ''
            }`}
          >
            {rating}
          </button>
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
  );;

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
      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          {messages.map((message, index) => (
            <div key={index} className={styles.messageWrapper}>
              {renderMessage(message, index)}
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default FillForm;