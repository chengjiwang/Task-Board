import type { IBoard } from '@/types';
import mongoose, { Schema } from 'mongoose';

const BoardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: true,
      default: 'My Task Board',
    },
    description: {
      type: String,
      default: 'Tasks to keep organised',
    },
  },
  { timestamps: true },
);

const Board =
  mongoose.models.Board || mongoose.model<IBoard>('Board', BoardSchema);

export default Board;
