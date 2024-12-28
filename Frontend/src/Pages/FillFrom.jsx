import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Styles/FillForm.module.css";
import axios from "axios";
import sendIcon from '../assets/SendIcon.png'; 

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
      if (currentMessage.type === "system") {
        setChatHistory((prev) => [...prev, currentMessage]);
        setCurrentIndex((prev) => prev + 1);
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

  

  
  React.useEffect(() => {
    handleNextMessage(); // Start with the first system message
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-box">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.type === "system" && <div dangerouslySetInnerHTML={{ __html: msg.data }} />}
            {msg.type === "user" && <div>{msg.data}</div>}
          </div>
        ))}
      </div>
      {currentIndex < messages.length && messages[currentIndex].type === "user" && (
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      )}
    </div>
  );
};
     
export default FillForm;


