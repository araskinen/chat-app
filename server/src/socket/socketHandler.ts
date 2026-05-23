import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Message } from "../models/Message";
import { User } from "../models/User";

interface AuthSocket extends Socket {
  userId?: string;
  username?: string;
}

export function registerSocketHandlers(io: Server) {
  // Authenticate every socket connection
  io.use(async (socket: AuthSocket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error("Authentication required"));

    try {
      const payload = jwt.verify(token, env.jwtSecret) as { userId: string };
      const user = await User.findById(payload.userId).select("username");
      if (!user) return next(new Error("User not found"));
      socket.userId = String(user._id);
      socket.username = user.username;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: AuthSocket) => {
    console.log(`🔌 ${socket.username} connected (${socket.id})`);

    // Join room
    socket.on("room:join", (roomId: string) => {
      socket.join(roomId);
      socket.to(roomId).emit("room:user-joined", {
        userId: socket.userId!,
        username: socket.username!,
      });
    });

    // Leave room
    socket.on("room:leave", (roomId: string) => {
      socket.leave(roomId);
      socket.to(roomId).emit("room:user-left", {
        userId: socket.userId!,
        username: socket.username!,
      });
    });

    // Send message
    socket.on(
      "message:send",
      async ({ roomId, content }: { roomId: string; content: string }) => {
        if (!content?.trim()) return;

        try {
          const message = await Message.create({
            content: content.trim(),
            sender: socket.userId,
            room: roomId,
          });

          const populated = await message.populate(
            "sender",
            "username avatarUrl",
          );

          // Broadcast to everyone in the room including sender
          io.to(roomId).emit("message:new", populated.toJSON());
        } catch (err) {
          socket.emit("error", "Failed to save message");
          console.error(err);
        }
      },
    );

    // Typing indicators
    socket.on("typing:start", (roomId: string) => {
      socket.to(roomId).emit("user:typing", {
        username: socket.username!,
        roomId,
      });
    });

    socket.on("typing:stop", (roomId: string) => {
      socket.to(roomId).emit("user:stopped-typing", {
        username: socket.username!,
        roomId,
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`🔌 ${socket.username} disconnected`);
    });
  });
}
