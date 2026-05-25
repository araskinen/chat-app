import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

const mockHandleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
const mockHandleToggleMode = vi.fn();
const mockSetEmail = vi.fn();
const mockSetPassword = vi.fn();
const mockSetUsername = vi.fn();

const mockFormState = {
  mode: "login" as "login" | "register",
  username: "",
  setUsername: mockSetUsername,
  email: "",
  setEmail: mockSetEmail,
  password: "",
  setPassword: mockSetPassword,
  isLoading: false,
  error: null as string | null,
  submitLabel: "Sign in",
  handleSubmit: mockHandleSubmit,
  handleToggleMode: mockHandleToggleMode,
};

vi.mock("@/features/auth/hooks/useAuthForm", () => ({
  useAuthForm: vi.fn(() => mockFormState),
}));

const { AuthForms } = await import("@/features/auth/components/AuthForms");

beforeEach(() => {
  vi.clearAllMocks();
  mockFormState.mode = "login";
  mockFormState.error = null;
  mockFormState.isLoading = false;
  mockFormState.submitLabel = "Sign in";
});

describe("AuthForms – login mode", () => {
  it("renders email input", () => {
    render(<AuthForms />);
    expect(document.querySelector('input[type="email"]')).toBeInTheDocument();
  });

  it("renders password input", () => {
    render(<AuthForms />);
    expect(
      document.querySelector('input[type="password"]'),
    ).toBeInTheDocument();
  });

  it("does not render username input in login mode", () => {
    render(<AuthForms />);
    // In login mode, only 2 inputs: email + password (no text input for username)
    const textInputs = document.querySelectorAll('input[type="text"]');
    expect(textInputs).toHaveLength(0);
  });

  it("renders the submit button with correct label", () => {
    render(<AuthForms />);
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("calls handleSubmit when the form is submitted", () => {
    render(<AuthForms />);
    const form = document.querySelector("form")!;
    fireEvent.submit(form);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});

describe("AuthForms – register mode", () => {
  it("renders username input in register mode", () => {
    mockFormState.mode = "register";
    mockFormState.submitLabel = "Create account";
    render(<AuthForms />);
    expect(document.querySelector('input[type="text"]')).toBeInTheDocument();
  });

  it("renders Create account button in register mode", () => {
    mockFormState.mode = "register";
    mockFormState.submitLabel = "Create account";
    render(<AuthForms />);
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });
});

describe("AuthForms – error state", () => {
  it("displays error message when error is set", () => {
    mockFormState.error = "Invalid credentials";
    render(<AuthForms />);
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("does not display error when error is null", () => {
    mockFormState.error = null;
    render(<AuthForms />);
    expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
  });
});

describe("AuthForms – loading state", () => {
  it("disables submit button when loading", () => {
    mockFormState.isLoading = true;
    mockFormState.submitLabel = "Please wait…";
    render(<AuthForms />);
    expect(screen.getByRole("button", { name: /please wait/i })).toBeDisabled();
  });
});
