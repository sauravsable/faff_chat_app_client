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

export interface SearchResult {
  id: string;
  message: string;
  score: number;
  createdAt: string | null;
  senderId: string;
  receiverId: string;
}

// Create axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 🔑 Attach token from localStorage automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// APIs
export const loginApi = async (payload: LoginPayload) => {
  const { data } = await instance.post("/login", payload);
  return data;
};

export const registerApi = async (payload: RegisterPayload) => {
  const { data } = await instance.post("/register", payload);
  return data;
};

export const userAuthApi = async () => {
  const { data } = await instance.get("/me");
  return data;
};

export const logoutApi = async () => {
  const { data } = await instance.get("/logout");
  return data;
};

export const getAllUsersApi = async () => {
  const { data } = await instance.get("/users");
  return data;
};

export const semanticSearch = async (
  q: string,
  top: number = 10
) => {
  const { data } = await instance.get<SearchResult[]>("semantic-search", {
    params: { q, top },
  });
  return data;
};
