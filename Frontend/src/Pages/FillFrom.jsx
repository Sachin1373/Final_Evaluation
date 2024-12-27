import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Styles/FillForm.module.css";
import axios from "axios";

function FillForm() {
  const { formId } = useParams();
  const [messages, setMessages] = useState([]); // Initialize as an empty array
  const [currentInput, setCurrentInput] = useState("");
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("UserDetails")) || null);
  console.log(messages, "hiiii");

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
        setMessages(res.data.content); // Set the fetched content to messages
        toast.success("Form content fetched successfully!");
      } catch (error) {
        console.error("Error fetching form content:", error);
        toast.error("Error fetching form content!");
      }
    };

    fetchFormContent();
  }, [formId, userDetails?.token]); // Add dependency for userDetails.token

  const handleSend = () => {
    if (currentInput.trim()) {
      const newMessage = { type: "reply", data: currentInput };
      setMessages((prev) => [...prev, newMessage]);
      setCurrentInput(""); // Clear the input field
    }
  };

  const getInputField = (inputType) => {
    switch (inputType) {
      case "text-input":
        return (
          <input
            type="text"
            placeholder="Enter text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className={styles.input}
          />
        );
      case "number":
        return (
          <input
            type="number"
            placeholder="Enter number"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className={styles.input}
          />
        );
      case "email":
        return (
          <input
            type="email"
            placeholder="Enter email"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className={styles.input}
          />
        );
      case "phone":
        return (
          <input
            type="tel"
            placeholder="Enter phone number"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className={styles.input}
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className={styles.input}
          />
        );
      case "rating":
        return (
          <input
            type="number"
            placeholder="Enter rating (1-5)"
            value={currentInput}
            min="1"
            max="5"
            onChange={(e) => setCurrentInput(e.target.value)}
            className={styles.input}
          />
        );
      case "button":
        return (
          <button
            onClick={handleSend}
            disabled={!currentInput.trim()}
            className={styles.submitButton}
          >
            Submit
          </button>
        );
      default:
        return (
          <input
            type="text"
            placeholder="Enter text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className={styles.input}
          />
        );
    }
  };

  return (
    <div className={styles.chatMessages}>
      <ToastContainer />
      <h1>Fill Form</h1>
      {messages.map((message, index) => {
        if (message.type === "text") {
          return (
            <div key={index} className={styles.chatText}>
              {message.data}
            </div>
          );
        } else if (message.type === "input") {
          return (
            <div key={index} className={styles.chatInput}>
              {getInputField(message.data)}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default FillForm;
