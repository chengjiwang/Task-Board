'use client';

import type { IBoard } from '@/types';
import { useRouter } from 'next/navigation';

interface BoardCardProps {
  board: IBoard;
}

export default function BoardCard({ board }: BoardCardProps) {
  const router = useRouter();
  const id = board._id.toString();

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div
        className="relative group bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => router.push(`/board/${id}`)}
      >
        <h2 className="font-semibold text-gray-900 text-base pr-8 truncate">
          {board.name}
        </h2>

        {board.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {board.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>
            {board.tasks.length} task{board.tasks.length !== 1 ? 's' : ''}
          </span>
          <span>{formatDate(board.createdAt)}</span>
        </div>
      </div>
    </>
  );
}
