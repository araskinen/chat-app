import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'

import { env } from './config/env'
import { connectDB } from './config/db'
import { connectRedis, pubClient, subClient } from './config/redis'
import { authRouter, roomsRouter, messagesRouter } from './routes/index'
import { errorHandler } from './middleware/errorHandler'
import { registerSocketHandlers } from './socket/socketHandler'

async function bootstrap() {
  // ── Connect to external services ──────────────────────────────────────────
  await connectDB()
  await connectRedis()

  // ── Express app ───────────────────────────────────────────────────────────
  const app = express()

  app.use(cors({ origin: env.corsOrigins, credentials: true }))
  app.use(express.json())

  app.get('/healthz', (_req, res) => res.json({ status: 'ok' }))
  app.use('/api/auth',     authRouter)
  app.use('/api/rooms',    roomsRouter)
  app.use('/api/messages', messagesRouter)
  app.use(errorHandler)

  // ── HTTP + Socket.IO server ───────────────────────────────────────────────
  const httpServer = http.createServer(app)

  const io = new Server(httpServer, {
    cors: { origin: env.corsOrigins, credentials: true },
  })

  // Redis adapter for multi-instance pub/sub
  io.adapter(createAdapter(pubClient, subClient))

  registerSocketHandlers(io)

  // ── Listen ────────────────────────────────────────────────────────────────
  httpServer.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port}`)
  })
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
