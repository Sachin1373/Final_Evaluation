import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

export const createTypeBot = async (name, folderId, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/typebot/createtypebot`,
      { name, folderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.message;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create TypeBot.";
  }
};

export const fetchTypeBot = async (folderId, token) => {
  try {
    const params = folderId ? { folderId } : {};
    const response = await axios.get(`${API_BASE_URL}/typebot/getTypeBot`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch TypeBot.";
  }
};

export const deleteTypeBot = async (typeBotId, token) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/typebot/deleteTypeBot`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { typeBotId },
      }
    );
    return response.data.message;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete TypeBot.";
  }
};
