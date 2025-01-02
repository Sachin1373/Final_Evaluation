import React, { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../Contexts/AuthContext';
import { useTheme } from "../Contexts/ThemeContext";
import axios from "axios";

const SharedDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const {isLoggedIn} = useContext(AuthContext)
   const { isDarkMode, toggleTheme } = useTheme(); 
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("UserDetails")) || null); 
  const navigate = useNavigate(); 

  const { dashboardId } = useParams(); // Extract from URL path
  const permission = searchParams.get("permission"); // Extract from query params

  

  useEffect(() => {
    if (!userDetails) {
      const currentPath = `/shared-dashboard/${dashboardId}?permission=${permission}`;
      localStorage.setItem("redirectAfterLogin", currentPath);
      navigate("/login");
      return;
    }
    const fetchDashboard = async () => {
      try {
        const response = await axios.post(
          `https://final-evaluation-qbj9.onrender.com/api/v1/dashboard/shared-dashboard?dashboardId=${dashboardId}&permission=${permission}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userDetails.token}`,
            },
          }
        );
        setDashboard(response.data.dashboard);
        navigate(`/dashboard`);
        
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching dashboard.");
      }
    };

    fetchDashboard();
  }, [dashboardId, permission]);

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!dashboard) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard Sharing via Link</h1>
      <h2>{dashboard.name}</h2>
    </div>
  );
};

export default SharedDashboard;
