'use server';

import Task from '@/models/Task';
import type { ITask } from '@/types';
import { isValidObjectId } from 'mongoose';
import { revalidatePath } from 'next/cache';
import connectDB from '../mongodb';
import { TaskInput, TaskUpdateInput } from '../validation';

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function addTask(
  boardId: string,
  data: Pick<ITask, 'name'> &
    Partial<Pick<ITask, 'description' | 'icon' | 'status'>>,
): Promise<ActionResult> {
  if (!isValidObjectId(boardId)) {
    return { ok: false, error: 'Invalid board ID' };
  }
  const parsed = TaskInput.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid task data' };
  }
  try {
    await connectDB();
    // Use max(order) + 1 rather than a count, so deleting tasks never
    // causes a newly added task to reuse an existing order value.
    const last = await Task.findOne({ boardId }).sort({ order: -1 }).lean();
    await Task.create({
      ...parsed.data,
      boardId,
      order: last ? last.order + 1 : 0,
    });
  } catch {
    return { ok: false, error: 'Failed to add task. Please try again.' };
  }
  revalidatePath(`/board/${boardId}`);
  revalidatePath('/');
  return { ok: true };
}

export async function updateTask(
  taskId: string,
  data: Partial<Pick<ITask, 'name' | 'description' | 'icon' | 'status'>>,
): Promise<ActionResult> {
  if (!isValidObjectId(taskId)) {
    return { ok: false, error: 'Invalid task ID' };
  }
  const parsed = TaskUpdateInput.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid task data' };
  }
  await connectDB();
  const task = await Task.findByIdAndUpdate(taskId, parsed.data, {
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
  revalidatePath(`/board/${boardId}`);
  revalidatePath('/');
  return { ok: true };
}
