import { Schema, model, Document, Types } from 'mongoose'

export interface IRoom extends Document {
  name: string
  description?: string
  createdBy: Types.ObjectId
  members: Types.ObjectId[]
  createdAt: Date
}

const roomSchema = new Schema<IRoom>(
  {
    name:        { type: String, required: true, unique: true, trim: true, maxlength: 50 },
    description: { type: String, maxlength: 200 },
    createdBy:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members:     [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

export const Room = model<IRoom>('Room', roomSchema)
