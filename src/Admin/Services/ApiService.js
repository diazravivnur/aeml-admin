// ApiService.js
import Domain from "../../Api/Api";
import { AuthToken } from "../../Api/Api";

const ApiService = {
  fetchList: async (endpoint) => {
    try {
      const response = await fetch(`${Domain()}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${AuthToken()}`,
        },
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching list:", error);
      throw error;
    }
  },

  createItem: async (endpoint, formData) => {
    try {
      const response = await fetch(`${Domain()}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AuthToken()}`,
        },
        body: formData,
      });
      return response.json();
    } catch (error) {
      console.error("Error creating item:", error);
      throw error;
    }
  },

  updateItem: async (endpoint, id, formData) => {
    try {
      const response = await fetch(`${Domain()}/${endpoint}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${AuthToken()}`,
        },
        body: formData,
      });
      return response.json();
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  },

  deleteItem: async (endpoint, id) => {
    try {
      const response = await fetch(`${Domain()}/${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${AuthToken()}`,
        },
      });
      return response.json();
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    }
  },
};

export default ApiService;
