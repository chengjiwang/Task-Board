import { Types } from 'mongoose';

export type TaskIcon =
  | 'clock'
  | 'bubble'
  | 'coffee'
  | 'workout'
  | 'stack'
  | 'person';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'wont_do';

export interface IBoard {
  _id: Types.ObjectId | string;
  name: string;
  description?: string;
  /** @deprecated legacy field, no longer read; removed in the next step */
  tasks?: (Types.ObjectId | string)[];
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

export interface IBoardWithTasks extends Omit<IBoard, 'tasks'> {
  tasks: ITask[];
}

export interface IBoardWithCount extends Omit<IBoard, 'tasks'> {
  taskCount: number;
}
