'use server';

import Board from '@/models/Board';
import Task from '@/models/Task';
import type { IBoard } from '@/types';
import { revalidatePath } from 'next/cache';
import connectDB from '../mongodb';

export async function getBoards(): Promise<IBoard[]> {
  await connectDB();
  const boards = await Board.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(boards));
}

export async function getBoard(boardId: string): Promise<IBoard | null> {
  await connectDB();
  const board = await Board.findById(boardId).populate('tasks').lean();
  if (!board) return null;
  return JSON.parse(JSON.stringify(board));
}

export async function createBoard(
  data: Pick<IBoard, 'name'> & Partial<Pick<IBoard, 'description'>>,
): Promise<string> {
  await connectDB();
  const board = await Board.create(data);
  revalidatePath('/');
  return board._id.toString();
}

export async function updateBoard(
  boardId: string,
  data: Partial<Pick<IBoard, 'name' | 'description'>>,
): Promise<void> {
  await connectDB();
  await Board.findByIdAndUpdate(boardId, data);
  revalidatePath(`/board/${boardId}`);
  revalidatePath('/');
}

export async function deleteBoard(boardId: string): Promise<void> {
  await connectDB();
  await Board.findByIdAndDelete(boardId);
  await Task.deleteMany({ boardId });
  revalidatePath('/');
}
