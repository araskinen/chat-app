import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../../models/User";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}, 60_000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("User model", () => {
  it("hashes password on create", async () => {
    const user = await User.create({
      username: "alice",
      email: "alice@example.com",
      password: "plaintext123",
    });
    expect(user.password).not.toBe("plaintext123");
    expect(user.password).toMatch(/^\$2[aby]\$/);
  });

  it("does not re-hash when other fields change", async () => {
    const user = await User.create({
      username: "bob",
      email: "bob@example.com",
      password: "secret",
    });
    const firstHash = user.password;
    user.avatarUrl = "https://example.com/avatar.jpg";
    await user.save();
    expect(user.password).toBe(firstHash);
  });

  it("comparePassword returns true for correct password", async () => {
    const user = await User.create({
      username: "carol",
      email: "carol@example.com",
      password: "correct123",
    });
    expect(await user.comparePassword("correct123")).toBe(true);
  });

  it("comparePassword returns false for wrong password", async () => {
    const user = await User.create({
      username: "dave",
      email: "dave@example.com",
      password: "correct123",
    });
    expect(await user.comparePassword("wrong")).toBe(false);
  });

  it("excludes password from toJSON output", async () => {
    const user = await User.create({
      username: "eve",
      email: "eve@example.com",
      password: "secret",
    });
    const json = user.toJSON() as Record<string, unknown>;
    expect(json).not.toHaveProperty("password");
  });

  it("rejects duplicate username", async () => {
    await User.create({
      username: "frank",
      email: "frank@example.com",
      password: "password",
    });
    await expect(
      User.create({
        username: "frank",
        email: "frank2@example.com",
        password: "password",
      }),
    ).rejects.toThrow();
  });

  it("rejects duplicate email", async () => {
    await User.create({
      username: "grace",
      email: "grace@example.com",
      password: "password",
    });
    await expect(
      User.create({
        username: "grace2",
        email: "grace@example.com",
        password: "password",
      }),
    ).rejects.toThrow();
  });
});
