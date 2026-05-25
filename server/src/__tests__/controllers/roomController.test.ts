import type { Response, NextFunction } from "express";
import {
  listRooms,
  createRoom,
  joinRoom,
} from "../../controllers/roomController";
import { Room } from "../../models/Room";
import type { AuthRequest } from "../../middleware/authMiddleware";

jest.mock("../../models/Room", () => ({
  Room: {
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

function makeRes() {
  const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
  (res.status as jest.Mock).mockReturnValue(res);
  return res;
}

const next = jest.fn() as NextFunction;

const mockRooms = [
  { _id: "r1", name: "general", members: ["u1"] },
  { _id: "r2", name: "random", members: [] },
];

beforeEach(() => jest.clearAllMocks());

describe("listRooms", () => {
  it("returns an array of rooms", async () => {
    (Room.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockRooms),
      }),
    });
    const req = { userId: "u1" } as AuthRequest;
    const res = makeRes();

    await listRooms(req, res, next);

    expect(res.json).toHaveBeenCalledWith(mockRooms);
  });

  it("calls next on error", async () => {
    const err = new Error("db error");
    (Room.find as jest.Mock).mockReturnValue({
      sort: jest
        .fn()
        .mockReturnValue({ limit: jest.fn().mockRejectedValue(err) }),
    });
    const req = { userId: "u1" } as AuthRequest;
    const res = makeRes();

    await listRooms(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

describe("createRoom", () => {
  it("returns 400 when name is missing", async () => {
    const req = { body: {}, userId: "u1" } as AuthRequest;
    const res = makeRes();

    await createRoom(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Room name is required" });
  });

  it("returns 400 when name is whitespace only", async () => {
    const req = { body: { name: "   " }, userId: "u1" } as AuthRequest;
    const res = makeRes();

    await createRoom(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 201 with new room on success", async () => {
    const newRoom = { _id: "r3", name: "gaming", members: ["u1"] };
    (Room.create as jest.Mock).mockResolvedValue(newRoom);
    const req = {
      body: { name: "gaming", description: "For gamers" },
      userId: "u1",
    } as AuthRequest;
    const res = makeRes();

    await createRoom(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newRoom);
    expect(Room.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "gaming",
        createdBy: "u1",
        members: ["u1"],
      }),
    );
  });

  it("returns 409 on duplicate name (mongo code 11000)", async () => {
    const dupError = Object.assign(new Error("duplicate"), { code: 11000 });
    (Room.create as jest.Mock).mockRejectedValue(dupError);
    const req = { body: { name: "general" }, userId: "u1" } as AuthRequest;
    const res = makeRes();

    await createRoom(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "A room with that name already exists",
    });
  });
});

describe("joinRoom", () => {
  it("returns the updated room on success", async () => {
    const updated = { _id: "r1", name: "general", members: ["u1", "u2"] };
    (Room.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);
    const req = {
      params: { roomId: "r1" },
      userId: "u2",
    } as unknown as AuthRequest;
    const res = makeRes();

    await joinRoom(req, res, next);

    expect(res.json).toHaveBeenCalledWith(updated);
    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
      "r1",
      { $addToSet: { members: "u2" } },
      { new: true },
    );
  });

  it("returns 404 when room is not found", async () => {
    (Room.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
    const req = {
      params: { roomId: "nonexistent" },
      userId: "u1",
    } as unknown as AuthRequest;
    const res = makeRes();

    await joinRoom(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Room not found" });
  });
});
