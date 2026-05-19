import { Response } from 'express'
import { Room } from '../models/Room'
import type { AuthRequest } from '../middleware/authMiddleware'

export async function listRooms(_req: AuthRequest, res: Response) {
  const rooms = await Room.find().sort({ createdAt: -1 }).limit(50)
  res.json(rooms)
}

export async function createRoom(req: AuthRequest, res: Response) {
  const { name, description } = req.body as { name: string; description?: string }
  if (!name?.trim()) { res.status(400).json({ message: 'Room name is required' }); return }
  const room = await Room.create({ name: name.trim(), description, createdBy: req.userId, members: [req.userId] })
  res.status(201).json(room)
}

export async function joinRoom(req: AuthRequest, res: Response) {
  const room = await Room.findByIdAndUpdate(
    req.params['roomId'],
    { $addToSet: { members: req.userId } },
    { new: true }
  )
  if (!room) { res.status(404).json({ message: 'Room not found' }); return }
  res.json(room)
}
