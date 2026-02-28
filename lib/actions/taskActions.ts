'use server';

import Board from '@/models/Board';
import Task from '@/models/Task';
import type { ITask } from '@/types';
import { revalidatePath } from 'next/cache';
import connectDB from '../mongodb';

export async function addTask(
  boardId: string,
  data: Pick<ITask, 'name'> &
    Partial<Pick<ITask, 'description' | 'icon' | 'status'>>,
): Promise<ITask> {
  await connectDB();
  const maxOrder = await Task.countDocuments({ boardId });
  const task = await Task.create({
    boardId,
    order: maxOrder,
    ...data,
  });
  await Board.findByIdAndUpdate(boardId, { $push: { tasks: task._id } });
  revalidatePath(`/board/${boardId}`);
  return JSON.parse(JSON.stringify(task));
}

export async function updateTask(
  taskId: string,
  data: Partial<Pick<ITask, 'name' | 'description' | 'icon' | 'status'>>,
): Promise<void> {
  await connectDB();
  const task = await Task.findByIdAndUpdate(taskId, data, { new: true });
  revalidatePath(`/board/${task.boardId}`);
}

export async function deleteTask(
  taskId: string,
  boardId: string,
): Promise<void> {
  await connectDB();
  await Task.findByIdAndDelete(taskId);
  await Board.findByIdAndUpdate(boardId, { $pull: { tasks: taskId } });
  revalidatePath(`/board/${boardId}`);
}
