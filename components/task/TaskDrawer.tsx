'use client';

import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { addTask, deleteTask, updateTask } from '@/lib/actions/taskActions';
import {
  ICON_EMOJI,
  SELECTABLE_STATUSES,
  STATUS_META,
  TASK_ICONS,
} from '@/lib/constants';
import type { ITask, TaskIcon, TaskStatus } from '@/types';
import { Check, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';

interface TaskDrawerProps {
  mode: 'create' | 'edit';
  task?: ITask;
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
  /** Only used in create mode — triggers optimistic update in TaskList */
  onAfterCreate?: (data: {
    name: string;
    description?: string;
    icon: TaskIcon;
    status: TaskStatus;
  }) => void | Promise<void>;
}

export default function TaskDrawer({
  isOpen,
  onClose,
  ...formProps
}: TaskDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent aria-describedby={undefined}>
        {/* The form only mounts while the sheet is open, so its state is
            initialised from props on every open — no effect needed. */}
        <TaskDrawerForm onClose={onClose} {...formProps} />
      </SheetContent>
    </Sheet>
  );
}

type TaskDrawerFormProps = Omit<TaskDrawerProps, 'isOpen'>;

function TaskDrawerForm({
  mode,
  task,
  boardId,
  onClose,
  onAfterCreate,
}: TaskDrawerFormProps) {
  const initial = mode === 'edit' ? task : undefined;
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [icon, setIcon] = useState<TaskIcon>(initial?.icon ?? 'person');
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'todo');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const uid = useId();
  const nameId = `${uid}-name`;
  const descId = `${uid}-description`;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsPending(true);
    try {
      const data = {
        name: name.trim(),
        description: description.trim(),
        icon,
        status,
      };
      if (mode === 'create') {
        if (onAfterCreate) {
          await onAfterCreate(data);
        } else {
          const res = await addTask(boardId, data);
          if (!res.ok) {
            setError(res.error);
            return;
          }
        }
      } else if (mode === 'edit' && task) {
        const res = await updateTask(task._id.toString(), data);
        if (!res.ok) {
          setError(res.error);
          router.refresh();
          return;
        }
      }
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== 'edit' || !task) return;
    setIsPending(true);
    try {
      const res = await deleteTask(task._id.toString(), boardId);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const toggleStatus = (s: TaskStatus) => {
    setStatus((prev) => (prev === s ? 'todo' : s));
  };

  return (
    <>
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <SheetTitle>
            {mode === 'create' ? 'Add New Task' : 'Edit Task'}
          </SheetTitle>
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
            {/* Task name */}
            <div>
              <label
                htmlFor={nameId}
                className="block text-xs font-medium text-action-secondary mb-1.5"
              >
                Task name
              </label>
              <Input
                id={nameId}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter task name"
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

            {/* Icon picker */}
            <div role="group" aria-labelledby={`${uid}-icon`}>
              <span
                id={`${uid}-icon`}
                className="block text-xs font-medium text-action-secondary mb-1.5"
              >
                Icon
              </span>
              <div className="flex gap-2 flex-wrap">
                {TASK_ICONS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-label={key}
                    aria-pressed={icon === key}
                    onClick={() => setIcon(key)}
                    className={`w-11 h-11 rounded-lg text-xl flex items-center justify-center transition-colors cursor-pointer ${
                      icon === key
                        ? 'bg-icon-bg-selected'
                        : 'bg-icon-bg-unselected hover:bg-icon-bg-selected'
                    }`}
                  >
                    {ICON_EMOJI[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* Status picker */}
            <div role="group" aria-labelledby={`${uid}-status`}>
              <span
                id={`${uid}-status`}
                className="block text-xs font-medium text-action-secondary mb-1.5"
              >
                Status
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SELECTABLE_STATUSES.map((key) => {
                  const { label, iconBg, iconSrc } = STATUS_META[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={status === key}
                      onClick={() => toggleStatus(key)}
                      className={`flex items-center gap-2 px-0.5 py-0.5 rounded-xl border-2 transition-colors text-left cursor-pointer bg-white ${
                        status === key
                          ? 'border-action-primary'
                          : 'border-gray-200'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
                      >
                        <Image src={iconSrc!} alt="" width={18} height={18} />
                      </div>
                      <span className="font-medium text-gray-800 flex-1 text-xs">
                        {label}
                      </span>
                      {status === key && (
                        <div className="mr-1 w-4 h-4 rounded-full bg-action-primary flex items-center justify-center shrink-0">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {error && (
            <p role="alert" className="px-6 text-sm text-red-600">
              {error}
            </p>
          )}
          {/* Footer buttons */}
          <div className="px-6 py-5 flex justify-end gap-3">
            {mode === 'edit' && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-action-secondary hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                Delete <Trash2 size={16} />
              </button>
            )}
            <button
              type="submit"
              disabled={!name.trim() || isPending}
              className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-action-primary hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              Save <Check size={16} />
            </button>
          </div>
        </form>
    </>
  );
}
