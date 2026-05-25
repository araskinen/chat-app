import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  authMiddleware,
  type AuthRequest,
} from "../../middleware/authMiddleware";

jest.mock("../../config/env", () => ({
  env: { jwtSecret: "test-secret-key", jwtExpiresIn: "1h" },
}));

const TEST_SECRET = "test-secret-key";

function makeReq(authHeader?: string): AuthRequest {
  return {
    headers: authHeader ? { authorization: authHeader } : {},
  } as AuthRequest;
}

function makeRes() {
  const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
  (res.status as jest.Mock).mockReturnValue(res);
  return res;
}

describe("authMiddleware", () => {
  let next: NextFunction;

  beforeEach(() => {
    next = jest.fn();
  });

  it("attaches userId and calls next for a valid token", () => {
    const token = jwt.sign({ userId: "user123" }, TEST_SECRET);
    const req = makeReq(`Bearer ${token}`);
    const res = makeRes();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.userId).toBe("user123");
  });

  it("returns 401 when Authorization header is missing", () => {
    const req = makeReq();
    const res = makeRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when header does not start with Bearer", () => {
    const req = makeReq("Token abc123");
    const res = makeRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
  });

  it("returns 401 for a token signed with wrong secret", () => {
    const token = jwt.sign({ userId: "user123" }, "wrong-secret");
    const req = makeReq(`Bearer ${token}`);
    const res = makeRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for a malformed token string", () => {
    const req = makeReq("Bearer not.a.valid.jwt");
    const res = makeRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired token",
    });
  });

  it("returns 401 for an expired token", () => {
    const token = jwt.sign({ userId: "user123" }, TEST_SECRET, {
      expiresIn: "0s",
    });
    const req = makeReq(`Bearer ${token}`);
    const res = makeRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired token",
    });
  });
});
