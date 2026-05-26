import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/shared/services/api", () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  },
  getErrorMessage: vi.fn((err: unknown, fallback: string) => {
    if (err instanceof Error) return err.message;
    return fallback;
  }),
}));

vi.mock("@/shared/services/socket", () => ({
  connectSocket: vi.fn(),
  disconnectSocket: vi.fn(),
}));

const { useAuthStore } = await import("@/features/auth/store/authStore");
const { authApi } = await import("@/shared/services/api");
const { connectSocket, disconnectSocket } =
  await import("@/shared/services/socket");

const mockUser = {
  _id: "u1",
  username: "alice",
  email: "alice@example.com",
  createdAt: "2024-01-01",
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useAuthStore.setState({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  });
});

describe("login", () => {
  it("sets user and token on success", async () => {
    (authApi.login as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: mockUser,
      token: "jwt-token",
    });

    await useAuthStore
      .getState()
      .login({ email: "alice@example.com", password: "pass" });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe("jwt-token");
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("stores token in localStorage on success", async () => {
    (authApi.login as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: mockUser,
      token: "jwt-token",
    });

    await useAuthStore
      .getState()
      .login({ email: "alice@example.com", password: "pass" });

    expect(localStorage.getItem("token")).toBe("jwt-token");
  });

  it("calls connectSocket with token on success", async () => {
    (authApi.login as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: mockUser,
      token: "jwt-token",
    });

    await useAuthStore
      .getState()
      .login({ email: "alice@example.com", password: "pass" });

    expect(connectSocket).toHaveBeenCalledWith("jwt-token");
  });

  it("sets error on failure", async () => {
    (authApi.login as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Invalid credentials"),
    );

    await useAuthStore
      .getState()
      .login({ email: "a@b.com", password: "wrong" });

    const state = useAuthStore.getState();
    expect(state.error).toBe("Invalid credentials");
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });
});

describe("register", () => {
  it("sets user and token on success", async () => {
    (authApi.register as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: mockUser,
      token: "jwt-token",
    });

    await useAuthStore.getState().register({
      username: "alice",
      email: "alice@example.com",
      password: "pass",
    });

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().token).toBe("jwt-token");
  });

  it("sets error on failure", async () => {
    (authApi.register as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Email taken"),
    );

    await useAuthStore.getState().register({
      username: "alice",
      email: "alice@example.com",
      password: "pass",
    });

    expect(useAuthStore.getState().error).toBe("Email taken");
  });
});

describe("logout", () => {
  it("clears user, token, and removes from localStorage", async () => {
    useAuthStore.setState({ user: mockUser, token: "jwt-token" });
    localStorage.setItem("token", "jwt-token");

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("calls disconnectSocket", () => {
    useAuthStore.setState({ user: mockUser, token: "jwt-token" });

    useAuthStore.getState().logout();

    expect(disconnectSocket).toHaveBeenCalled();
  });
});

describe("clearError", () => {
  it("clears the error field", () => {
    useAuthStore.setState({ error: "some error" });

    useAuthStore.getState().clearError();

    expect(useAuthStore.getState().error).toBeNull();
  });
});
