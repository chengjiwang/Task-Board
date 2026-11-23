'use server';

import Board from '@/models/Board';
import Task from '@/models/Task';
import type { ITask } from '@/types';
import { isValidObjectId } from 'mongoose';
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
  revalidatePath('/');
  return JSON.parse(JSON.stringify(task));
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateTask(
  taskId: string,
  data: Partial<Pick<ITask, 'name' | 'description' | 'icon' | 'status'>>,
): Promise<ActionResult> {
  if (!isValidObjectId(taskId)) {
    return { ok: false, error: 'Invalid task ID' };
  }
  await connectDB();
  const task = await Task.findByIdAndUpdate(taskId, data, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    return { ok: false, error: 'Task not found. It may have been deleted.' };
  }
  revalidatePath(`/board/${task.boardId}`);
  return { ok: true };
}

export async function deleteTask(
  taskId: string,
  boardId: string,
): Promise<ActionResult> {
  if (!isValidObjectId(taskId) || !isValidObjectId(boardId)) {
    return { ok: false, error: 'Invalid ID' };
  }
  await connectDB();
  await Task.findByIdAndDelete(taskId);
  await Board.findByIdAndUpdate(boardId, { $pull: { tasks: taskId } });
  revalidatePath(`/board/${boardId}`);
  revalidatePath('/');
  return { ok: true };
}
