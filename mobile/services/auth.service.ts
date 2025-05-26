import { authorizedAPI, unauthorizedAPI } from "@/config/axios.config";
import { handleApiRequest } from "./utils.service";

// loggin in to the account
export const login = async (email: string, password: string) => {
  return handleApiRequest(() =>
    unauthorizedAPI.post("/auth/login", { email, password })
  );
};

// registering into the system
export const register = async(username: string, email: string, password: string) => {
  return handleApiRequest(() =>
    unauthorizedAPI.post("/auth/register", { username, email, password })
  );
};

//getting current logged in user
export const getMe = async() => {
  return handleApiRequest(() => authorizedAPI.get("/auth/me"));
};

//forgot password
export const forgotPassword = async(email: string) => {
  return handleApiRequest(() =>
    unauthorizedAPI.post("/auth/forgot-password", { email })
  );
};

//resetting the password
export const resetPassword = async(code: string, newPassword: string) => {
  return handleApiRequest(() =>
    unauthorizedAPI.post("/auth/reset-password", { code, newPassword })
  );
};
