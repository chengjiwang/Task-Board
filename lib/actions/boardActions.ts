'use server';

import Board from '@/models/Board';
import Task from '@/models/Task';
import type { IBoard, IBoardWithCount, IBoardWithTasks } from '@/types';
import { revalidatePath } from 'next/cache';
import connectDB from '../mongodb';
import { redirect } from 'next/navigation';
import { isValidObjectId } from 'mongoose';
import type { ActionResult } from './taskActions';
import { BoardInput, BoardUpdateInput } from '../validation';

export async function getBoards(): Promise<IBoardWithCount[]> {
  await connectDB();
  const [boards, counts] = await Promise.all([
    Board.find().sort({ createdAt: -1 }).lean(),
    Task.aggregate<{ _id: unknown; count: number }>([
      { $group: { _id: '$boardId', count: { $sum: 1 } } },
    ]),
  ]);
  const countByBoard = new Map(counts.map((c) => [String(c._id), c.count]));
  const result = boards.map((board) => ({
    ...board,
    taskCount: countByBoard.get(String(board._id)) ?? 0,
  }));
  return JSON.parse(JSON.stringify(result));
}

export async function getBoard(
  boardId: string,
): Promise<IBoardWithTasks | null> {
  if (!/^[0-9a-f]{24}$/i.test(boardId)) return null;
  await connectDB();
  const board = await Board.findById(boardId).lean();
  if (!board) return null;
  // createdAt as tiebreaker: legacy data may contain duplicate `order` values
  const tasks = await Task.find({ boardId })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return JSON.parse(JSON.stringify({ ...board, tasks }));
}

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
    await Board.findByIdAndDelete(boardId);
    await Task.deleteMany({ boardId });
  } catch {
    return { ok: false, error: 'Failed to delete board. Please try again.' };
  }
  revalidatePath('/');
  redirect('/'); // Redirect to home after deletion to avoid showing a now-nonexistent board page
}
