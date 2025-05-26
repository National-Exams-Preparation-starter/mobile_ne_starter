import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({
    mutationFn: ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => register(username, email, password),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => forgotPassword(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      code,
      newPassword,
    }: {
      code: string;
      newPassword: string;
    }) => resetPassword(code, newPassword),
  });
};
