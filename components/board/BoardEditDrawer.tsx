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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { deleteBoard, updateBoard } from '@/lib/actions/boardActions';
import type { IBoard } from '@/types';
import { Check, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BoardEditDrawerProps {
  board: IBoard;
  isOpen: boolean;
  onClose: () => void;
}

export default function BoardEditDrawer({
  board,
  isOpen,
  onClose,
}: BoardEditDrawerProps) {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPending, setIsPending] = useState(false);

  // Sync form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setName(board.name);
      setDescription(board.description ?? '');
    }
  }, [isOpen, board]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsPending(true);
    try {
      await updateBoard(board._id.toString(), {
        name: name.trim(),
        description: description.trim(),
      });
      
      router.prefetch('/');
      router.refresh();
      onClose();
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAlert(true);
  };

  const handleConfirmDelete = async () => {
    setIsPending(true);
    await deleteBoard(board._id.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-(--color-overlay)"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* loading overlay */}
        {isPending && (
          <div className="absolute inset-0 z-20 bg-white/80 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
            <p className="text-sm text-gray-600 font-medium">Processing…</p>
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-lg font-bold text-gray-900">Edit Board</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md border hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 px-6 py-4 space-y-5">
          {/* Board name */}
          <div>
            <label className="block text-xs font-medium text-action-secondary mb-1.5">
              Board name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter board name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-action-secondary mb-1.5">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a short description"
              rows={3}
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-5 flex justify-end gap-3">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-(--color-action-secondary) hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            Delete <Trash2 size={16} />
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={isPending || !name.trim()}
            className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-(--color-action-primary) hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            Save <Check size={16} />
          </button>
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
    </div>
  );
}
