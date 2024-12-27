import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function FillFrom() {
    const { formId } = useParams();
    const [formContent, setFormContent] = useState(null);
    const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("UserDetails")) || null);

    useEffect(() => {
        const fetchFormContent = async () => {
          try {
            const res = await axios.get(`https://final-evaluation-qbj9.onrender.com/api/v1/typebot/get-form-content/${formId}`,{
                headers: {
                    Authorization: `Bearer ${userDetails.token}`,
                },
            });
            setFormContent(res.data.content);
            toast.success("Form content fetched successfully!");
          } catch (error) {
            console.error("Error fetching form content:", error);
            toast.error("Error fetching form content!");
          }
        };
    
        fetchFormContent();
      }, [formId]);

  return (
    <div><ToastContainer /></div>
  )
}

export default FillFrom