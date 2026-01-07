import { API_BASE_URL } from "@/config/api";
import { User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = API_BASE_URL 

const loginUser =  (user: User) => {
  return fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
};

const registerUser =  (user: User) => {
  return fetch(`${API_URL}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
};


const UserService = {
  loginUser,
  registerUser,
};

export default UserService;
