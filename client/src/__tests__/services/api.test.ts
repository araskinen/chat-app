import { describe, it, expect, vi, beforeEach } from "vitest";

const mockPost = vi.fn();
const mockGet = vi.fn();
let capturedRequestInterceptor:
  | ((config: Record<string, unknown>) => Record<string, unknown>)
  | null = null;

vi.mock("axios", () => {
  const mockInstance = {
    post: mockPost,
    get: mockGet,
    interceptors: {
      request: {
        use: vi.fn((fn) => {
          capturedRequestInterceptor = fn;
        }),
      },
    },
  };
  return {
    default: {
      create: vi.fn(() => mockInstance),
      isAxiosError: vi.fn(
        (err: unknown) =>
          typeof err === "object" && err !== null && "isAxiosError" in err,
      ),
    },
  };
});

// Import after mock is registered
const { authApi, roomsApi, messagesApi, getErrorMessage } =
  await import("@/shared/services/api");

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("getErrorMessage", () => {
  it("extracts server error message from axios error", () => {
    const err = {
      isAxiosError: true,
      response: { data: { message: "Email already taken" } },
      message: "Request failed",
    };
    expect(getErrorMessage(err, "fallback")).toBe("Email already taken");
  });

  it("falls back to axios message when no server message", () => {
    const err = {
      isAxiosError: true,
      response: { data: {} },
      message: "Network Error",
    };
    expect(getErrorMessage(err, "fallback")).toBe("Network Error");
  });

  it("uses fallback for non-axios errors", () => {
    expect(getErrorMessage("oops", "fallback")).toBe("fallback");
  });

  it("uses Error message for native errors", () => {
    expect(getErrorMessage(new Error("native error"), "fallback")).toBe(
      "native error",
    );
  });
});

describe("JWT interceptor", () => {
  it("attaches Authorization header when token is in localStorage", () => {
    localStorage.setItem("token", "my-jwt");
    const config = { headers: {} } as Record<string, unknown>;
    const result = capturedRequestInterceptor!(config) as {
      headers: Record<string, string>;
    };
    expect(result.headers["Authorization"]).toBe("Bearer my-jwt");
  });

  it("does not attach Authorization header when no token", () => {
    const config = { headers: {} } as Record<string, unknown>;
    const result = capturedRequestInterceptor!(config) as {
      headers: Record<string, string>;
    };
    expect(result.headers["Authorization"]).toBeUndefined();
  });
});

describe("authApi", () => {
  it("login calls POST /auth/login and returns data", async () => {
    const data = { token: "jwt", user: { _id: "u1" } };
    mockPost.mockResolvedValue({ data });
    const result = await authApi.login({ email: "a@b.com", password: "pass" });
    expect(mockPost).toHaveBeenCalledWith("/auth/login", {
      email: "a@b.com",
      password: "pass",
    });
    expect(result).toEqual(data);
  });

  it("register calls POST /auth/register and returns data", async () => {
    const data = { token: "jwt", user: { _id: "u1" } };
    mockPost.mockResolvedValue({ data });
    const result = await authApi.register({
      username: "alice",
      email: "a@b.com",
      password: "pass",
    });
    expect(mockPost).toHaveBeenCalledWith("/auth/register", expect.any(Object));
    expect(result).toEqual(data);
  });
});

describe("roomsApi", () => {
  it("list calls GET /rooms", async () => {
    mockGet.mockResolvedValue({ data: [] });
    await roomsApi.list();
    expect(mockGet).toHaveBeenCalledWith("/rooms");
  });

  it("join calls POST /rooms/:id/join", async () => {
    mockPost.mockResolvedValue({ data: { _id: "r1" } });
    await roomsApi.join("r1");
    expect(mockPost).toHaveBeenCalledWith("/rooms/r1/join");
  });
});

describe("messagesApi", () => {
  it("list calls GET /messages/:roomId with page param", async () => {
    mockGet.mockResolvedValue({ data: [] });
    await messagesApi.list("room1", 2);
    expect(mockGet).toHaveBeenCalledWith("/messages/room1", {
      params: { page: 2 },
    });
  });
});
