'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createBoard } from '@/lib/actions/boardActions';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function CreateBoardButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    if (!name.trim()) return;
    startTransition(async () => {
      const boardId = await createBoard({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setOpen(false);
      setName('');
      setDescription('');
      router.push(`/board/${boardId}`);
    });
  };

  const handleOpenChange = (value: boolean) => {
    if (!isPending) {
      setOpen(value);
      if (!value) {
        setName('');
        setDescription('');
      }
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-action-primary hover:bg-action-primary/80 text-white"
      >
        + New Board
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">New Board</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium text-action-secondary"
                htmlFor="board-name"
              >
                Board name <span className="text-red-500">*</span>
              </label>
              <Input
                id="board-name"
                placeholder="Enter board name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium text-action-secondary"
                htmlFor="board-description"
              >
                Description
              </label>
              <Textarea
                id="board-description"
                placeholder="Enter a short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isPending || !name.trim()}
              className="bg-action-primary hover:bg-action-primary/80 text-white"
            >
              {isPending ? 'Creating...' : 'Create Board'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
