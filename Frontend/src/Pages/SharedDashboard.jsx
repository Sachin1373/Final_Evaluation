import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
// import styles from "../Styles/SharedDashboard.module.css";

const SharedDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const dashboardId = searchParams.get("dashboardId");
  const permission = searchParams.get("permission");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.post(
          `https://final-evaluation-qbj9.onrender.com/api/v1/dashboard/shared-dashboard`,
          {
            params: { dashboardId, permission },
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
    return <div className={styles.error}>{error}</div>;
  }

  if (!dashboard) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.sharedDashboard}>
      <h2>{dashboard.name}</h2>
    </div>
  );
};

export default SharedDashboard;
