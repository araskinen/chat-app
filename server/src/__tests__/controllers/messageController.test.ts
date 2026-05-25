import type { Response, NextFunction } from "express";
import { listMessages } from "../../controllers/messageController";
import { Message } from "../../models/Message";
import type { AuthRequest } from "../../middleware/authMiddleware";

jest.mock("../../models/Message", () => ({
  Message: {
    find: jest.fn(),
  },
}));

function makeRes() {
  const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
  (res.status as jest.Mock).mockReturnValue(res);
  return res;
}

const next = jest.fn() as NextFunction;

const mockMessages = [
  {
    _id: "m1",
    content: "Hello",
    sender: { _id: "u1", username: "alice" },
    room: "r1",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    _id: "m2",
    content: "World",
    sender: { _id: "u2", username: "bob" },
    room: "r1",
    createdAt: "2024-01-01T10:01:00Z",
  },
];

function mockChain(result: unknown) {
  const chain = {
    sort: jest.fn(),
    skip: jest.fn(),
    limit: jest.fn(),
    populate: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  chain.sort.mockReturnValue(chain);
  chain.skip.mockReturnValue(chain);
  chain.limit.mockReturnValue(chain);
  chain.populate.mockReturnValue(chain);
  return chain;
}

beforeEach(() => jest.clearAllMocks());

describe("listMessages", () => {
  it("returns messages in chronological order", async () => {
    const reversed = [...mockMessages].reverse();
    (Message.find as jest.Mock).mockReturnValue(mockChain(reversed));
    const req = {
      params: { roomId: "r1" },
      query: {},
      userId: "u1",
    } as unknown as AuthRequest;
    const res = makeRes();

    await listMessages(req, res, next);

    expect(res.json).toHaveBeenCalledWith(mockMessages);
  });

  it("uses page parameter for skip calculation", async () => {
    const chain = mockChain([]);
    (Message.find as jest.Mock).mockReturnValue(chain);
    const req = {
      params: { roomId: "r1" },
      query: { page: "3" },
      userId: "u1",
    } as unknown as AuthRequest;
    const res = makeRes();

    await listMessages(req, res, next);

    expect(chain.skip).toHaveBeenCalledWith(100); // (3 - 1) * 50
  });

  it("defaults to page 1 when page param is missing", async () => {
    const chain = mockChain([]);
    (Message.find as jest.Mock).mockReturnValue(chain);
    const req = {
      params: { roomId: "r1" },
      query: {},
      userId: "u1",
    } as unknown as AuthRequest;
    const res = makeRes();

    await listMessages(req, res, next);

    expect(chain.skip).toHaveBeenCalledWith(0);
  });

  it("queries by roomId", async () => {
    (Message.find as jest.Mock).mockReturnValue(mockChain([]));
    const req = {
      params: { roomId: "room-abc" },
      query: {},
      userId: "u1",
    } as unknown as AuthRequest;
    const res = makeRes();

    await listMessages(req, res, next);

    expect(Message.find).toHaveBeenCalledWith({ room: "room-abc" });
  });

  it("calls next on error", async () => {
    const err = new Error("db error");
    const chain = mockChain(null);
    chain.lean.mockRejectedValue(err);
    (Message.find as jest.Mock).mockReturnValue(chain);
    const req = {
      params: { roomId: "r1" },
      query: {},
      userId: "u1",
    } as unknown as AuthRequest;
    const res = makeRes();

    await listMessages(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});
