import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Styles/FillForm.module.css";
import axios from "axios";
import sendIcon from "../assets/SendIcon.png";

function FillForm() {
  const { formId } = useParams();
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("UserDetails")) || null;

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

    if (userDetails) fetchFormContent();
    else toast.error("User not authenticated!");
  }, [formId, userDetails]);

  const handleSend = (value = inputValue) => {
    if (!value.toString().trim()) {
      toast.error("Response cannot be empty!");
      return;
    }
    setUserResponses((prev) => ({ ...prev, [currentStep]: value }));
    setInputValue("");
    setRating(0);
    setCurrentStep((prev) => prev + 1);
  };

  const handleRatingSelect = (selectedRating) => {
    setRating(selectedRating);
    handleSend(selectedRating.toString());
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Replace with your API endpoint for submitting responses
      // const response = await axios.post('your-api-endpoint', { responses: userResponses });
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingInput = () => (
    <div className={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`${styles.ratingButton} ${rating >= star ? styles.active : ""}`}
          onClick={() => handleRatingSelect(star)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          {star}
        </button>
      ))}
    </div>
  );

  const renderInputField = (item) => (
    <div className={styles.inputContainer}>
      <input
        type={getInputType(item.data)}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={getPlaceholder(item.data)}
        className={styles.input}
        aria-label={getPlaceholder(item.data)}
      />
      <button
        onClick={() => handleSend()}
        className={styles.sendButton}
        aria-label="Send response"
      >
        <img src={sendIcon} alt="Send" className={styles.sendIcon} />
      </button>
    </div>
  );

  const getInputType = (dataType) => {
    const types = {
      "text-input": "text",
      number: "number",
      email: "email",
      phone: "tel",
      date: "date",
    };
    return types[dataType] || "text";
  };

  const getPlaceholder = (dataType) => {
    const placeholders = {
      "text-input": "Enter your response",
      number: "Enter a number",
      email: "Enter your email",
      phone: "Enter your phone number",
      date: "Select date",
    };
    return placeholders[dataType] || "Type your response";
  };

  const renderStep = (item, index) => {
    if (index > currentStep) return null;

    if (item.type === "text") {
      return (
        <div key={index} className={styles.botMessageContainer}>
          <div className={styles.botMessage}>
            <p>{item.data}</p>
          </div>
        </div>
      );
    }

    if (item.type === "image") {
      return (
        <div key={index} className={styles.botMessageContainer}>
          <div className={styles.botMessage}>
            <img src={item.data} alt="Chat content" className={styles.chatImage} />
          </div>
        </div>
      );
    }

    if (item.type === "input" && index === currentStep) {
      if (item.data === "button") {
        return (
          <div key={index} className={styles.submitButtonContainer}>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={styles.submitButton}
              aria-label="Submit form"
            >
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </button>
          </div>
        );
      }

      if (item.data === "rating") return renderRatingInput();

      return renderInputField(item);
    }

    if (item.type === "input" && userResponses[index]) {
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
