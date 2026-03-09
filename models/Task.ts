import type { ITask } from '@/types';
import mongoose, { Schema } from 'mongoose';

const TaskSchema = new Schema<ITask>(
  {
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: 'New Task',
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
      enum: ['clock', 'bubble', 'coffee', 'workout', 'stack', 'person'],
      default: 'stack',
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed', 'wont_do'],
      default: 'todo',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
