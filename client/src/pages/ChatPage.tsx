import { useEffect } from 'react'
import { RoomSidebar } from '@/components/chat/RoomSidebar'
import { MessageList } from '@/components/chat/MessageList'
import { MessageInput } from '@/components/chat/MessageInput'
import { useSocket } from '@/hooks/useSocket'
import { useMessages } from '@/hooks/useMessages'
import { useChatStore } from '@/store/chatStore'
import { roomsApi } from '@/services/api'
import { getSocket } from '@/services/socket'

export function ChatPage() {
  useSocket() // register all socket listeners

  const { rooms, activeRoomId, setRooms, addRoom, setActiveRoom } = useChatStore()
  const { messages, typingUsers, sendMessage, onTyping } = useMessages(activeRoomId)

  // Load rooms on mount
  useEffect(() => {
    roomsApi.list().then(setRooms)
  }, [setRooms])

  const handleSelectRoom = (roomId: string) => {
    if (activeRoomId) getSocket().emit('room:leave', activeRoomId)
    setActiveRoom(roomId)
    getSocket().emit('room:join', roomId)
  }

  const handleCreateRoom = async (name: string, description?: string) => {
    const room = await roomsApi.create(name, description)
    addRoom(room)
    handleSelectRoom(room._id)
  }

  const activeRoom = rooms.find((r) => r._id === activeRoomId)

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <RoomSidebar
        rooms={rooms}
        activeRoomId={activeRoomId}
        onSelectRoom={handleSelectRoom}
        onCreateRoom={handleCreateRoom}
      />

      {/* Main chat area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeRoom ? (
          <>
            {/* Room header */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e5e5', fontWeight: 500 }}>
              # {activeRoom.name}
              {activeRoom.description && (
                <span style={{ fontWeight: 400, fontSize: 13, color: '#888', marginLeft: 8 }}>
                  — {activeRoom.description}
                </span>
              )}
            </div>

            <MessageList messages={messages} typingUsers={typingUsers} />
            <MessageInput onSend={sendMessage} onTyping={onTyping} />
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 15 }}>
            Select a room to start chatting
          </div>
        )}
      </main>
    </div>
  )
}
