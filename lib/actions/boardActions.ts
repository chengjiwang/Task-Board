'use server';

import Board from '@/models/Board';
import Task from '@/models/Task';
import type { IBoard } from '@/types';
import { revalidatePath } from 'next/cache';
import connectDB from '../mongodb';
import { redirect } from 'next/navigation';
import { isValidObjectId } from 'mongoose';
import type { ActionResult } from './taskActions';
import { BoardInput, BoardUpdateInput } from '../validation';

export async function createBoard(
  data: Pick<IBoard, 'name'> & Partial<Pick<IBoard, 'description'>>,
): Promise<string> {
  const parsed = BoardInput.parse(data);
  await connectDB();
  const board = await Board.create(parsed);
  revalidatePath('/');
  return board._id.toString();
}

export async function updateBoard(
  boardId: string,
  data: Partial<Pick<IBoard, 'name' | 'description'>>,
): Promise<ActionResult> {
  if (!isValidObjectId(boardId)) {
    return { ok: false, error: 'Invalid board ID' };
  }
  const parsed = BoardUpdateInput.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid board data' };
  }
  try {
    await connectDB();
    const board = await Board.findByIdAndUpdate(boardId, parsed.data, {
      runValidators: true,
    });
    if (!board) {
      return { ok: false, error: 'Board not found. It may have been deleted.' };
    }
  } catch {
    return { ok: false, error: 'Failed to update board. Please try again.' };
  }
  revalidatePath(`/board/${boardId}`);
  revalidatePath('/');
  return { ok: true };
}

// On success this redirects to '/' (never returns); it only returns on failure.
export async function deleteBoard(
  boardId: string,
): Promise<ActionResult | undefined> {
  if (!isValidObjectId(boardId)) {
    return { ok: false, error: 'Invalid board ID' };
  }
  try {
    await connectDB();
    // Delete tasks first: if the second step fails we are left with an empty
    // (visible, retryable) board rather than invisible orphan tasks.
    await Task.deleteMany({ boardId });
    await Board.findByIdAndDelete(boardId);
  } catch {
    return { ok: false, error: 'Failed to delete board. Please try again.' };
  }
  revalidatePath('/');
  redirect('/'); // Redirect to home after deletion to avoid showing a now-nonexistent board page
}
