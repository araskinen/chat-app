import type { Request, Response, NextFunction } from "express";
import { register, login, me } from "../../controllers/authController";
import { User } from "../../models/User";
import type { AuthRequest } from "../../middleware/authMiddleware";

jest.mock("../../config/env", () => ({
  env: { jwtSecret: "test-secret-key", jwtExpiresIn: "1h" },
}));

jest.mock("../../models/User", () => ({
  User: {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}));

function makeRes() {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  (res.status as jest.Mock).mockReturnValue(res);
  return res;
}

const next = jest.fn() as NextFunction;

const mockUser = {
  _id: "user123",
  username: "alice",
  email: "alice@example.com",
  comparePassword: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe("register", () => {
  it("returns 400 when fields are missing", async () => {
    const req = { body: { email: "a@b.com" } } as Request;
    const res = makeRes();

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) }),
    );
  });

  it("returns 409 when email or username is taken", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    const req = {
      body: {
        username: "alice",
        email: "alice@example.com",
        password: "secret",
      },
    } as Request;
    const res = makeRes();

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email or username already taken",
    });
  });

  it("returns 201 with token and user on success", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue(mockUser);
    const req = {
      body: {
        username: "alice",
        email: "alice@example.com",
        password: "secret",
      },
    } as Request;
    const res = makeRes();

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    const call = (res.json as jest.Mock).mock.calls[0][0] as Record<
      string,
      unknown
    >;
    expect(call).toHaveProperty("token");
    expect(call.user).toBe(mockUser);
  });

  it("calls next on unexpected error", async () => {
    const err = new Error("db error");
    (User.findOne as jest.Mock).mockRejectedValue(err);
    const req = {
      body: {
        username: "alice",
        email: "alice@example.com",
        password: "secret",
      },
    } as Request;
    const res = makeRes();

    await register(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

describe("login", () => {
  it("returns 401 when user is not found", async () => {
    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });
    const req = { body: { email: "no@one.com", password: "pass" } } as Request;
    const res = makeRes();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  it("returns 401 when password is wrong", async () => {
    mockUser.comparePassword.mockResolvedValue(false);
    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });
    const req = {
      body: { email: "alice@example.com", password: "wrong" },
    } as Request;
    const res = makeRes();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns token and user on success", async () => {
    mockUser.comparePassword.mockResolvedValue(true);
    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });
    const req = {
      body: { email: "alice@example.com", password: "correct" },
    } as Request;
    const res = makeRes();

    await login(req, res, next);

    expect(res.status).not.toHaveBeenCalledWith(401);
    const call = (res.json as jest.Mock).mock.calls[0][0] as Record<
      string,
      unknown
    >;
    expect(call).toHaveProperty("token");
    expect(call.user).toBe(mockUser);
  });
});

describe("me", () => {
  it("returns 404 when user does not exist", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);
    const req = { userId: "user123" } as AuthRequest;
    const res = makeRes();

    await me(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("returns the user when found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    const req = { userId: "user123" } as AuthRequest;
    const res = makeRes();

    await me(req, res, next);

    expect(res.json).toHaveBeenCalledWith(mockUser);
  });
});
