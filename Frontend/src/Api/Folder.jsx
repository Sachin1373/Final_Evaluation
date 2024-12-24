import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

export const getFolders = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/folder/getfolders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.folders;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch folders.";
  }
};

export const deleteFolder = async (folderId, token) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/folder/deletefolder/${folderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.message;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete folder.";
  }
};
