import { Schema, model, Document, Types } from 'mongoose'

export interface IMessage extends Document {
  content: string
  sender: Types.ObjectId
  room: Types.ObjectId
  createdAt: Date
}

const messageSchema = new Schema<IMessage>(
  {
    content: { type: String, required: true, maxlength: 2000 },
    sender:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    room:    { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  },
  { timestamps: true }
)

// Auto-delete messages older than 30 days (free tier storage friendly)
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 })
// Speed up room history queries
messageSchema.index({ room: 1, createdAt: -1 })

export const Message = model<IMessage>('Message', messageSchema)
