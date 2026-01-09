import { User } from "@/types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const loginUser = (user: User) => {
  return fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
};

const registerUser = (user: User) => {
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
