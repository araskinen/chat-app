import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockClearError = vi.fn();

vi.mock("@/features/auth/store/authStore", () => ({
  useAuthStore: vi.fn((selector?: (s: Record<string, unknown>) => unknown) => {
    const state = {
      login: mockLogin,
      register: mockRegister,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    };
    return typeof selector === "function" ? selector(state) : state;
  }),
}));

const { useAuthForm } = await import("@/features/auth/hooks/useAuthForm");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useAuthForm", () => {
  it("starts in login mode", () => {
    const { result } = renderHook(() => useAuthForm());
    expect(result.current.mode).toBe("login");
  });

  it("initialises all fields as empty strings", () => {
    const { result } = renderHook(() => useAuthForm());
    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.username).toBe("");
  });

  it("updates email field", () => {
    const { result } = renderHook(() => useAuthForm());
    act(() => result.current.setEmail("test@example.com"));
    expect(result.current.email).toBe("test@example.com");
  });

  it("updates password field", () => {
    const { result } = renderHook(() => useAuthForm());
    act(() => result.current.setPassword("secret123"));
    expect(result.current.password).toBe("secret123");
  });

  it("updates username field", () => {
    const { result } = renderHook(() => useAuthForm());
    act(() => result.current.setUsername("alice"));
    expect(result.current.username).toBe("alice");
  });

  it("toggles to register mode on handleToggleMode", () => {
    const { result } = renderHook(() => useAuthForm());
    act(() => result.current.handleToggleMode());
    expect(result.current.mode).toBe("register");
  });

  it("toggles back to login mode on second handleToggleMode", () => {
    const { result } = renderHook(() => useAuthForm());
    act(() => result.current.handleToggleMode());
    act(() => result.current.handleToggleMode());
    expect(result.current.mode).toBe("login");
  });

  it("calls clearError when toggling mode", () => {
    const { result } = renderHook(() => useAuthForm());
    act(() => result.current.handleToggleMode());
    expect(mockClearError).toHaveBeenCalled();
  });

  it('shows "Sign in" submit label in login mode', () => {
    const { result } = renderHook(() => useAuthForm());
    expect(result.current.submitLabel).toBe("Sign in");
  });

  it('shows "Create account" submit label in register mode', () => {
    const { result } = renderHook(() => useAuthForm());
    act(() => result.current.handleToggleMode());
    expect(result.current.submitLabel).toBe("Create account");
  });

  it("calls login with email and password on submit in login mode", async () => {
    const { result } = renderHook(() => useAuthForm());
    act(() => {
      result.current.setEmail("alice@example.com");
      result.current.setPassword("pass123");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: "alice@example.com",
      password: "pass123",
    });
  });

  it("calls register with all fields on submit in register mode", async () => {
    const { result } = renderHook(() => useAuthForm());
    act(() => {
      result.current.handleToggleMode();
      result.current.setUsername("alice");
      result.current.setEmail("alice@example.com");
      result.current.setPassword("pass123");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(mockRegister).toHaveBeenCalledWith({
      username: "alice",
      email: "alice@example.com",
      password: "pass123",
    });
  });
});
