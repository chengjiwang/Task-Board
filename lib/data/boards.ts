import 'server-only';

import Board from '@/models/Board';
import Task from '@/models/Task';
import type { IBoardWithCount, IBoardWithTasks } from '@/types';
import connectDB from '../mongodb';

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
