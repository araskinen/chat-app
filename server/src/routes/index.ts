import { Router } from 'express'
import * as auth from '../controllers/authController'
import * as rooms from '../controllers/roomController'
import * as messages from '../controllers/messageController'
import { authMiddleware } from '../middleware/authMiddleware'

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authRouter = Router()
authRouter.post('/register', auth.register)
authRouter.post('/login',    auth.login)
authRouter.get('/me',        authMiddleware, auth.me)

// ── Rooms ────────────────────────────────────────────────────────────────────
export const roomsRouter = Router()
roomsRouter.use(authMiddleware)
roomsRouter.get('/',                 rooms.listRooms)
roomsRouter.post('/',                rooms.createRoom)
roomsRouter.post('/:roomId/join',    rooms.joinRoom)

// ── Messages ─────────────────────────────────────────────────────────────────
export const messagesRouter = Router()
messagesRouter.use(authMiddleware)
messagesRouter.get('/:roomId', messages.listMessages)
