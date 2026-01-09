import { API_BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = API_BASE_URL;

export const ChatService = {
  async getAuthToken(): Promise<string | null> {
    const user = await AsyncStorage.getItem("loggedInUser");
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.token || null;
    }
    return null;
  },

  async getMessages() {
    const token = await ChatService.getAuthToken(); 
    if (!token) throw new Error("No token found");

    const response = await fetch(`${API_URL}/messages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch messages: ${text}`);
    }

    return response.json();
  },

  async sendMessage(text: string) {
    const token = await ChatService.getAuthToken();
    if (!token) throw new Error("No token found");

    const response = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(text),    });

    if (!response.ok) {
      const textResponse = await response.text();
      throw new Error(`Failed to send message: ${textResponse}`);
    }

    return response.json();
  },
};
