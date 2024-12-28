import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Styles/FillForm.module.css";
import axios from "axios";
import sendIcon from '../assets/send.png'; // Make sure to add this image

function FillForm() {
  const { formId } = useParams();
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const getInputType = (dataType) => {
    switch (dataType) {
      case 'text-input':
        return 'text';
      case 'number':
        return 'number';
      case 'email':
        return 'email';
      case 'phone':
        return 'tel';
      case 'date':
        return 'date';
      default:
        return 'text';
    }
  };

  const getPlaceholder = (dataType) => {
    switch (dataType) {
      case 'text-input':
        return 'Enter your response';
      case 'number':
        return 'Enter a number';
      case 'email':
        return 'Enter your email';
      case 'phone':
        return 'Enter your phone number';
      case 'date':
        return 'Select date';
      default:
        return 'Type your response';
    }
  };

  const handleSend = (value = inputValue) => {
    if (value.toString().trim()) {
      setUserResponses(prev => ({
        ...prev,
        [currentStep]: value
      }));
      setInputValue('');
      setRating(0);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleRatingSelect = (selectedRating) => {
    setRating(selectedRating);
    handleSend(selectedRating.toString());
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Add your API call here to submit the form responses
      // const response = await axios.post('your-api-endpoint', { responses: userResponses });
      toast.success('Form submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit form!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingInput = () => {
    return (
      <div className={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`${styles.ratingButton} ${rating >= star ? styles.active : ''}`}
            onClick={() => handleRatingSelect(star)}
          >
            {star}
          </button>
        ))}
      </div>
    );
  };

  const renderStep = (item, index) => {
    if (index > currentStep) return null;

    if (item.type === 'text') {
      return (
        <div key={index} className={styles.botMessageContainer}>
          <div className={styles.botMessage}>
            <p>{item.data}</p>
          </div>
        </div>
      );
    }

    if (item.type === 'image') {
      return (
        <div key={index} className={styles.botMessageContainer}>
          <div className={styles.botMessage}>
            <img src={item.data} alt="Chat image" className={styles.chatImage} />
          </div>
        </div>
      );
    }

    if (item.type === 'input' && index === currentStep) {
      if (item.data === 'button') {
        return (
          <div key={index} className={styles.submitButtonContainer}>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        );
      }

      if (item.data === 'rating') {
        return (
          <div key={index} className={styles.inputContainer}>
            {renderRatingInput()}
          </div>
        );
      }

      return (
        <div key={index} className={styles.inputContainer}>
          <input
            type={getInputType(item.data)}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={getPlaceholder(item.data)}
            className={styles.input}
          />
          <button
            onClick={() => handleSend()}
            className={styles.sendButton}
          >
            <img src={sendIcon} alt="Send" className={styles.sendIcon} />
          </button>
        </div>
      );
    }

    if (item.type === 'input' && userResponses[index]) {
      return (
        <div key={index} className={styles.userMessageContainer}>
          <div className={styles.userMessage}>
            <p>{userResponses[index]}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.chatContainer}>
      <ToastContainer />
      <div className={styles.chatBox}>
        <div className={styles.messagesContainer}>
          {messages.map((item, index) => renderStep(item, index))}
        </div>
      </div>
    </div>
  );
}

export default FillForm;