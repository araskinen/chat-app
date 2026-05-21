import axios from "axios";

export const getErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    const serverMsg = (err.response?.data as { message?: string })?.message;
    return serverMsg ?? err.message;
  }
  return err instanceof Error ? err.message : fallback;
}

import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  Room,
  Message,
} from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", payload).then((r) => r.data),

  me: () => api.get<AuthResponse["user"]>("/auth/me").then((r) => r.data),
};

// ─── Rooms ───────────────────────────────────────────────────────────────────
export const roomsApi = {
  list: () => api.get<Room[]>("/rooms").then((r) => r.data),

  create: (name: string, description?: string) =>
    api.post<Room>("/rooms", { name, description }).then((r) => r.data),

  join: (roomId: string) =>
    api.post<Room>(`/rooms/${roomId}/join`).then((r) => r.data),
};

// ─── Messages ────────────────────────────────────────────────────────────────
export const messagesApi = {
  list: (roomId: string, page = 1) =>
    api
      .get<Message[]>(`/messages/${roomId}`, { params: { page } })
      .then((r) => r.data),
};

export default api;
