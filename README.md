# Real-Time Chat App

Full-stack real-time chat application built with React, Node.js, Socket.IO, and MongoDB.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| State | Zustand |
| Real-time | Socket.IO client |
| Backend | Node.js + Express + TypeScript |
| Real-time server | Socket.IO server |
| Auth | JWT + bcrypt |
| Database | MongoDB + Mongoose |
| Cache / Pub-Sub | Redis (Upstash) |

## Free deployment targets

| Service | Role |
|---------|------|
| Vercel | React SPA |
| Railway | Node.js API + Socket.IO |
| MongoDB Atlas M0 | Database (512 MB free) |
| Upstash Redis | Redis (10k cmds/day free) |

## Project structure

```
chat-app/
├── client/          # React SPA
│   └── src/
│       ├── components/
│       │   ├── auth/      # Login, Register forms
│       │   ├── chat/      # MessageList, MessageInput, RoomSidebar, TypingIndicator
│       │   └── ui/        # Button, Input, Avatar (shared primitives)
│       ├── hooks/         # useSocket, useAuth, useMessages
│       ├── pages/         # LoginPage, ChatPage
│       ├── services/      # api.ts (axios), socket.ts (Socket.IO singleton)
│       ├── store/         # Zustand slices: authStore, chatStore
│       └── types/         # Shared TypeScript types
│
└── server/          # Node.js API + Socket.IO
    └── src/
        ├── config/        # db.ts, redis.ts, env.ts
        ├── controllers/   # authController, roomController, messageController
        ├── middleware/     # authMiddleware, errorHandler
        ├── models/        # User, Room, Message (Mongoose)
        ├── routes/        # auth, rooms, messages
        ├── socket/        # socketHandler, roomEvents, messageEvents
        └── types/         # Express + Socket augmentations
```

## Quick start

```bash
# 1. Install all dependencies
npm run install:all

# 2. Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# 3. Start both dev servers (runs on :3000 + :4000)
npm run dev
```

## Environment variables

See `server/.env.example` and `client/.env.example` for all required variables.
