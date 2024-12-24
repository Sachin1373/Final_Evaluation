import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

export const createDashboard = async (username, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/dashboard/createdashboard`,
      { username },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create dashboard.";
  }
};
