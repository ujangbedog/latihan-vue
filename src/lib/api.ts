import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://api.vue.xpqx.xyz/v2";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleApiError = (error: any, context: string): never => {
  console.error(`Error ${context}:`, error);
  throw error;
};
