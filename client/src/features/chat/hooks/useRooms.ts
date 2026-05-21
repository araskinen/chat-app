import { useEffect, useState } from "react";
import { useChatStore } from "@/features/chat/store/chatStore";
import { roomsApi, getErrorMessage } from "@/shared/services/api";
import { getSocket } from "@/shared/services/socket";

export const useRooms = () => {
  const { rooms, activeRoomId, setRooms, addRoom, setActiveRoom } =
    useChatStore();
  const [roomsError, setRoomsError] = useState<string | null>(null);

  useEffect(() => {
    roomsApi
      .list()
      .then(setRooms)
      .catch((err) =>
        setRoomsError(getErrorMessage(err, "Failed to load rooms")),
      );
  }, [setRooms]);

  const handleSelectRoom = (roomId: string) => {
    if (activeRoomId) getSocket().emit("room:leave", activeRoomId);
    setActiveRoom(roomId);
    getSocket().emit("room:join", roomId);
  };

  const handleCreateRoom = async (name: string, description?: string) => {
    try {
      setRoomsError(null);
      const room = await roomsApi.create(name, description);
      addRoom(room);
      handleSelectRoom(room._id);
    } catch (err) {
      setRoomsError(getErrorMessage(err, "Failed to create room"));
    }
  };

  return {
    rooms,
    activeRoomId,
    roomsError,
    handleSelectRoom,
    handleCreateRoom,
  };
};
