import jwt from "jsonwebtoken";
import { registerSocketHandlers } from "../../socket/socketHandler";
import { User } from "../../models/User";
import { Message } from "../../models/Message";

jest.mock("../../config/env", () => ({
  env: { jwtSecret: "test-secret-key" },
}));

jest.mock("../../models/User", () => ({
  User: { findById: jest.fn() },
}));

jest.mock("../../models/Message", () => ({
  Message: { create: jest.fn() },
}));

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: jest.fn(),
}));

function makeIo() {
  const toResult = { emit: jest.fn() };
  return {
    use: jest.fn(),
    on: jest.fn(),
    to: jest.fn().mockReturnValue(toResult),
    _toResult: toResult,
  };
}

function makeSocket(overrides: Record<string, unknown> = {}) {
  const toResult = { emit: jest.fn() };
  const socket: Record<string, unknown> = {
    handshake: { auth: { token: "valid-token" } },
    userId: undefined,
    username: undefined,
    id: "socket-id-1",
    join: jest.fn(),
    leave: jest.fn(),
    to: jest.fn().mockReturnValue(toResult),
    emit: jest.fn(),
    on: jest.fn(),
    _toResult: toResult,
    ...overrides,
  };
  return socket;
}

function getRegisteredHandler(mockFn: jest.Mock, event: string) {
  const call = mockFn.mock.calls.find((c) => c[0] === event);
  return call ? call[1] : undefined;
}

beforeEach(() => jest.clearAllMocks());

describe("registerSocketHandlers", () => {
  let io: ReturnType<typeof makeIo>;
  let authMiddlewareFn: (socket: unknown, next: jest.Mock) => Promise<void>;
  let connectionHandler: (socket: ReturnType<typeof makeSocket>) => void;

  beforeEach(() => {
    io = makeIo();
    registerSocketHandlers(io as never);
    authMiddlewareFn = io.use.mock.calls[0][0] as typeof authMiddlewareFn;
    connectionHandler = io.on.mock.calls[0][1] as typeof connectionHandler;
  });

  describe("auth middleware", () => {
    it("calls next with error when no token", async () => {
      const socket = makeSocket({ handshake: { auth: {} } });
      const next = jest.fn();
      await authMiddlewareFn(socket, next);
      expect(next).toHaveBeenCalledWith(new Error("Authentication required"));
    });

    it("calls next with error when jwt.verify throws", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("invalid signature");
      });
      const socket = makeSocket();
      const next = jest.fn();
      await authMiddlewareFn(socket, next);
      expect(next).toHaveBeenCalledWith(new Error("Invalid token"));
    });

    it("calls next with error when user is not found", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: "u1" });
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });
      const socket = makeSocket();
      const next = jest.fn();
      await authMiddlewareFn(socket, next);
      expect(next).toHaveBeenCalledWith(new Error("User not found"));
    });

    it("sets userId/username and calls next on valid auth", async () => {
      const mockUser = { _id: "u1", username: "alice" };
      (jwt.verify as jest.Mock).mockReturnValue({ userId: "u1" });
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      const socket = makeSocket() as Record<string, unknown>;
      const next = jest.fn();
      await authMiddlewareFn(socket, next);
      expect((socket as Record<string, unknown>).userId).toBe("u1");
      expect((socket as Record<string, unknown>).username).toBe("alice");
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("room:join", () => {
    it("joins the socket to the room and broadcasts user-joined", () => {
      const socket = makeSocket({ userId: "u1", username: "alice" });
      connectionHandler(socket);

      const handler = getRegisteredHandler(socket.on as jest.Mock, "room:join");
      handler("room1");

      expect(socket.join).toHaveBeenCalledWith("room1");
      expect(socket.to).toHaveBeenCalledWith("room1");
      expect(
        (socket._toResult as { emit: jest.Mock }).emit,
      ).toHaveBeenCalledWith("room:user-joined", {
        userId: "u1",
        username: "alice",
      });
    });
  });

  describe("room:leave", () => {
    it("leaves the room and broadcasts user-left", () => {
      const socket = makeSocket({ userId: "u1", username: "alice" });
      connectionHandler(socket);

      const handler = getRegisteredHandler(
        socket.on as jest.Mock,
        "room:leave",
      );
      handler("room1");

      expect(socket.leave).toHaveBeenCalledWith("room1");
      expect(
        (socket._toResult as { emit: jest.Mock }).emit,
      ).toHaveBeenCalledWith("room:user-left", {
        userId: "u1",
        username: "alice",
      });
    });
  });

  describe("message:send", () => {
    it("ignores empty content", async () => {
      const socket = makeSocket({ userId: "u1", username: "alice" });
      connectionHandler(socket);

      const handler = getRegisteredHandler(
        socket.on as jest.Mock,
        "message:send",
      );
      await handler({ roomId: "room1", content: "   " });

      expect(Message.create).not.toHaveBeenCalled();
    });

    it("persists message and broadcasts to the room", async () => {
      const populated = {
        _id: "msg1",
        content: "Hello",
        toJSON: jest.fn().mockReturnValue({ _id: "msg1", content: "Hello" }),
      };
      const mockMsg = { populate: jest.fn().mockResolvedValue(populated) };
      (Message.create as jest.Mock).mockResolvedValue(mockMsg);

      const socket = makeSocket({ userId: "u1", username: "alice" });
      connectionHandler(socket);

      const handler = getRegisteredHandler(
        socket.on as jest.Mock,
        "message:send",
      );
      await handler({ roomId: "room1", content: "Hello" });

      expect(Message.create).toHaveBeenCalledWith(
        expect.objectContaining({
          content: "Hello",
          sender: "u1",
          room: "room1",
        }),
      );
      expect(io.to).toHaveBeenCalledWith("room1");
      expect(io._toResult.emit).toHaveBeenCalledWith(
        "message:new",
        expect.any(Object),
      );
    });

    it("emits error on message:send failure", async () => {
      (Message.create as jest.Mock).mockRejectedValue(new Error("db fail"));
      const socket = makeSocket({ userId: "u1", username: "alice" });
      connectionHandler(socket);

      const handler = getRegisteredHandler(
        socket.on as jest.Mock,
        "message:send",
      );
      await handler({ roomId: "room1", content: "Hello" });

      expect(socket.emit).toHaveBeenCalledWith(
        "error",
        "Failed to save message",
      );
    });
  });

  describe("typing:start / typing:stop", () => {
    it("broadcasts user:typing on typing:start", () => {
      const socket = makeSocket({ userId: "u1", username: "alice" });
      connectionHandler(socket);

      const handler = getRegisteredHandler(
        socket.on as jest.Mock,
        "typing:start",
      );
      handler("room1");

      expect(
        (socket._toResult as { emit: jest.Mock }).emit,
      ).toHaveBeenCalledWith("user:typing", {
        username: "alice",
        roomId: "room1",
      });
    });

    it("broadcasts user:stopped-typing on typing:stop", () => {
      const socket = makeSocket({ userId: "u1", username: "alice" });
      connectionHandler(socket);

      const handler = getRegisteredHandler(
        socket.on as jest.Mock,
        "typing:stop",
      );
      handler("room1");

      expect(
        (socket._toResult as { emit: jest.Mock }).emit,
      ).toHaveBeenCalledWith("user:stopped-typing", {
        username: "alice",
        roomId: "room1",
      });
    });
  });
});
