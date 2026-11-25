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
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { deleteBoard, updateBoard } from '@/lib/actions/boardActions';
import type { IBoard } from '@/types';
import { Check, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { unstable_rethrow } from 'next/navigation';
import { useId, useState } from 'react';

interface BoardEditDrawerProps {
  board: Pick<IBoard, '_id' | 'name' | 'description'>;
  isOpen: boolean;
  onClose: () => void;
}

export default function BoardEditDrawer({
  isOpen,
  onClose,
  board,
}: BoardEditDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent aria-describedby={undefined}>
        {/* The form only mounts while the sheet is open, so its state is
            initialised from props on every open — no effect needed. */}
        <BoardEditForm board={board} onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
}

function BoardEditForm({
  board,
  onClose,
}: Omit<BoardEditDrawerProps, 'isOpen'>) {
  const uid = useId();
  const nameId = `${uid}-name`;
  const descId = `${uid}-description`;
  const [showAlert, setShowAlert] = useState(false);
  const [name, setName] = useState(board.name);
  const [description, setDescription] = useState(board.description ?? '');
  const [isPending, setIsPending] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsPending(true);
    try {
      const res = await updateBoard(board._id.toString(), {
        name: name.trim(),
        description: description.trim(),
      });

      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      onClose();
    } catch {
      toast.error('Failed to update board. Please try again.');
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
    try {
      const res = await deleteBoard(board._id.toString());
      if (res && !res.ok) {
        toast.error(res.error);
        setIsPending(false);
      }
    } catch (e) {
      // On success, deleteBoard calls redirect('/'), and Next.js rejects the
      // action promise with a redirect error so the router can navigate.
      // Re-throw it instead of treating it as a failure.
      unstable_rethrow(e);
      toast.error('Failed to delete board. Please try again.');
      setIsPending(false);
    }
  };

  return (
    <>
          {/* loading overlay */}
          {isPending && (
            <div className="absolute inset-0 z-20 bg-white/80 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
              <p role="status" className="text-sm text-gray-600 font-medium">
                Processing…
              </p>
            </div>
          )}
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-2">
            <SheetTitle>Edit Board</SheetTitle>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-md border hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="flex flex-1 flex-col">
            {/* Form */}
            <div className="flex-1 px-6 py-4 space-y-5">
              {/* Board name */}
              <div>
                <label
                  htmlFor={nameId}
                  className="block text-xs font-medium text-action-secondary mb-1.5"
                >
                  Board name
                </label>
                <Input
                  id={nameId}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter board name"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor={descId}
                  className="block text-xs font-medium text-action-secondary mb-1.5"
                >
                  Description
                </label>
                <Textarea
                  id={descId}
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
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-(--color-action-secondary) hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                Delete <Trash2 size={16} />
              </button>

              {/* Save */}
              <button
                type="submit"
                disabled={isPending || !name.trim()}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-(--color-action-primary) hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                Save <Check size={16} />
              </button>
            </div>
          </form>
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
