import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { RoomList } from "@/features/chat/components/RoomList";
import type { Room } from "@/shared/types";

const rooms: Room[] = [
  {
    _id: "r1",
    name: "general",
    createdBy: "u1",
    members: ["u1"],
    createdAt: "2024-01-01",
  },
  {
    _id: "r2",
    name: "random",
    createdBy: "u1",
    members: [],
    createdAt: "2024-01-01",
  },
];

const onSelectRoom = vi.fn();

beforeEach(() => vi.clearAllMocks());

describe("RoomList", () => {
  it("renders all room names", () => {
    render(
      <RoomList
        rooms={rooms}
        activeRoomId={null}
        onSelectRoom={onSelectRoom}
      />,
    );
    expect(screen.getByText(/general/)).toBeInTheDocument();
    expect(screen.getByText(/random/)).toBeInTheDocument();
  });

  it("renders empty list without crashing", () => {
    render(
      <RoomList rooms={[]} activeRoomId={null} onSelectRoom={onSelectRoom} />,
    );
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("calls onSelectRoom with the room id when clicked", async () => {
    render(
      <RoomList
        rooms={rooms}
        activeRoomId={null}
        onSelectRoom={onSelectRoom}
      />,
    );
    await userEvent.click(screen.getByText(/general/));
    expect(onSelectRoom).toHaveBeenCalledWith("r1");
  });

  it("renders correct number of room buttons", () => {
    render(
      <RoomList
        rooms={rooms}
        activeRoomId={null}
        onSelectRoom={onSelectRoom}
      />,
    );
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
