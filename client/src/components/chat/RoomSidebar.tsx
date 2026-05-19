import { useState } from 'react'
import type { Room } from '@/types'
import { useAuthStore } from '@/store/authStore'

interface Props {
  rooms: Room[]
  activeRoomId: string | null
  onSelectRoom: (roomId: string) => void
  onCreateRoom: (name: string, description?: string) => void
}

export function RoomSidebar({ rooms, activeRoomId, onSelectRoom, onCreateRoom }: Props) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [creating, setCreating] = useState(false)
  const [roomName, setRoomName] = useState('')

  const handleCreate = () => {
    if (!roomName.trim()) return
    onCreateRoom(roomName.trim())
    setRoomName('')
    setCreating(false)
  }

  return (
    <aside style={{
      width: 240, background: '#2C2C2A', color: '#D3D1C7',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #444' }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: '#fff' }}>💬 ChatApp</div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>@{user?.username}</div>
      </div>

      {/* Room list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
        <div style={{ padding: '0.5rem 1rem', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>
          Rooms
        </div>
        {rooms.map((room) => (
          <button
            key={room._id}
            onClick={() => onSelectRoom(room._id)}
            style={{
              width: '100%', textAlign: 'left', padding: '0.5rem 1rem',
              background: activeRoomId === room._id ? '#3C3489' : 'transparent',
              border: 'none', color: activeRoomId === room._id ? '#fff' : '#B4B2A9',
              cursor: 'pointer', fontSize: 14, borderRadius: 0,
            }}
          >
            # {room.name}
          </button>
        ))}
      </div>

      {/* Create room */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid #444' }}>
        {creating ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              autoFocus
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false) }}
              placeholder="Room name"
              style={{ flex: 1, padding: '0.4rem 0.5rem', borderRadius: 6, border: '1px solid #555', background: '#3d3d3a', color: '#fff', fontSize: 13 }}
            />
            <button onClick={handleCreate} style={{ padding: '0.4rem 0.6rem', borderRadius: 6, border: 'none', background: '#534AB7', color: '#fff', cursor: 'pointer', fontSize: 13 }}>+</button>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px dashed #555', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: 13 }}
          >
            + New room
          </button>
        )}
      </div>

      {/* Logout */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid #444' }}>
        <button
          onClick={logout}
          style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: 'none', background: '#3d3d3a', color: '#aaa', cursor: 'pointer', fontSize: 13 }}
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
