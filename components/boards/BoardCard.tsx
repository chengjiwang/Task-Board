'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteBoard } from '@/lib/actions/boardActions';
import type { IBoard } from '@/types';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface BoardCardProps {
  board: IBoard;
}

export default function BoardCard({ board }: BoardCardProps) {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [isPending, startTransition] = useTransition();

  const id = board._id.toString();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAlert(true);
  };

  const handleConfirmDelete = () => {
    startTransition(async () => {
      await deleteBoard(id);
    });
  };

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
        {/* Delete button - visible on hover */}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer"
          aria-label="Delete board"
        >
          <Trash2 size={16} />
        </button>

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

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Board</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{board.name}&quot;? This
              will also delete all tasks in this board. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
