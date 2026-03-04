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
  tasks: (Types.ObjectId | string)[];
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
