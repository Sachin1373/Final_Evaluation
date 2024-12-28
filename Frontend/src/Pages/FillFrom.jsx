import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Styles/FillForm.module.css";
import axios from "axios";

function FillForm() {
  const { formId } = useParams();
  const [chatHistory, setChatHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
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

  const handleNextMessage = () => {
    if (currentIndex < messages.length) {
      const currentMessage = messages[currentIndex];
      if (currentMessage.type === "text" || currentMessage.type === "image") {
        setChatHistory((prev) => [...prev, currentMessage]);
        setCurrentIndex((prev) => prev + 1);
      } else if (currentMessage.type === "input") {
        setChatHistory((prev) => [...prev, currentMessage]);
      }
    }
  };

  const handleSend = () => {
    if (userInput.trim()) {
      const userMessage = { type: "user", data: userInput };
      setChatHistory((prev) => [...prev, userMessage]);
      setUserInput("");
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => handleNextMessage(), 500);
    }
  };

  useEffect(() => {
    handleNextMessage(); // Start with the first system message
  }, []);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        {chatHistory.map((msg, index) => (
          <div key={index} className={`${styles.message} ${msg.type}`}>
            {msg.type === "text" && <div>{msg.data}</div>}
            {msg.type === "image" && <img src={msg.data} alt="chat" />}
            {msg.type === "input" && (
              <input
                type={msg.data}
                placeholder={`Enter ${msg.data}`}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    setChatHistory((prev) => [
                      ...prev,
                      { type: "user", data: e.target.value },
                    ]);
                    setUserInput("");
                    setCurrentIndex((prev) => prev + 1);
                  }
                }}
              />
            )}
            {msg.type === "user" && <div>{msg.data}</div>}
          </div>
        ))}
      </div>
      {currentIndex < messages.length && messages[currentIndex].type === "input" && (
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default FillForm;
