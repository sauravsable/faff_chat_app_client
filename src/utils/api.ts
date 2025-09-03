import axios from "axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const loginApi = async (payload: LoginPayload) => {
  const { data } = await instance.post("/login", payload, {
    withCredentials: true,
  });
  return data;
};

export const registerApi = async (payload: RegisterPayload) => {
  const { data } = await instance.post("/register", payload, {
    withCredentials: true,
  });
  return data;
};

export const userAuthApi = async () => {
  const { data } = await instance.get("/me", {
    withCredentials: true,
  });

  return data;
};

export const logoutApi = async () => {
  const { data } = await instance.get("/logout", {
    withCredentials: true,
  });

  return data;
};

export const getAllUsersApi  = async () => {
  const { data } = await instance.get("/users", {
    withCredentials: true,
  });

  return data;
};
