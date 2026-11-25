import type { TaskIcon, TaskStatus } from '@/lib/constants';
import { Types } from 'mongoose';

export type { TaskIcon, TaskStatus } from '@/lib/constants';

export interface IBoard {
  _id: Types.ObjectId | string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask {
  _id: Types.ObjectId | string;
  boardId: Types.ObjectId | string;
  name: string;
  description?: string;
  icon: TaskIcon;
  status: TaskStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBoardWithTasks extends IBoard {
  tasks: ITask[];
}

export interface IBoardWithCount extends IBoard {
  taskCount: number;
}
