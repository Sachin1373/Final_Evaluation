import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const SharedDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("UserDetails")) || null);  

  const { dashboardId } = useParams(); // Extract from URL path
  const permission = searchParams.get("permission"); // Extract from query params

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.post(
          `https://final-evaluation-qbj9.onrender.com/api/v1/dashboard/shared-dashboard`,
          {
            params: { dashboardId, permission },
          },
          {
            headers: {
              Authorization: `Bearer ${userDetails.token}`,
            },
          }
        );
        setDashboard(response.data.dashboard);
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
