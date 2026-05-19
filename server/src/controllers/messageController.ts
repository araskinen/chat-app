import { Response } from 'express'
import { Message } from '../models/Message'
import type { AuthRequest } from '../middleware/authMiddleware'

const PAGE_SIZE = 50

export async function listMessages(req: AuthRequest, res: Response) {
  const { roomId } = req.params
  const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10))

  const messages = await Message.find({ room: roomId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .populate('sender', 'username avatarUrl')
    .lean()

  // Return in chronological order
  res.json(messages.reverse())
}
