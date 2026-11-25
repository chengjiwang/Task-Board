import { TASK_ICONS, TASK_STATUSES } from '@/lib/constants';
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
      enum: TASK_ICONS,
      default: 'stack',
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: 'todo',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

TaskSchema.index({ boardId: 1, order: 1 });

const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
