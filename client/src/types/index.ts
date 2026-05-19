// ─── Domain types shared across components, stores, and services ───────────

export interface User {
  _id: string
  username: string
  email: string
  avatarUrl?: string
  createdAt: string
}

export interface Room {
  _id: string
  name: string
  description?: string
  createdBy: string
  members: string[]
  createdAt: string
}

export interface Message {
  _id: string
  content: string
  sender: User
  room: string
  createdAt: string
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

// ─── Socket events ──────────────────────────────────────────────────────────

export interface TypingPayload {
  roomId: string
  username: string
}

export interface JoinRoomPayload {
  roomId: string
}

export interface SendMessagePayload {
  roomId: string
  content: string
}
