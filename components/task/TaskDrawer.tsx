'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addTask, deleteTask, updateTask } from '@/lib/actions/taskActions';
import type { ITask, TaskIcon, TaskStatus } from '@/types';
import { Check, Clock, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ICONS: { key: TaskIcon; emoji: string }[] = [
  { key: 'person', emoji: '🧑‍💻' },
  { key: 'bubble', emoji: '💬' },
  { key: 'coffee', emoji: '☕' },
  { key: 'workout', emoji: '🏋️‍♂️' },
  { key: 'stack', emoji: '📚' },
  { key: 'clock', emoji: '⏰' },
];

const STATUS_OPTIONS: {
  key: TaskStatus;
  label: string;
  iconBg: string;
  Icon: React.ElementType;
  iconColor: string;
}[] = [
  {
    key: 'in_progress',
    label: 'In Progress',
    iconBg: 'bg-in-progress-icon',
    Icon: Clock,
    iconColor: 'text-white',
  },
  {
    key: 'completed',
    label: 'Completed',
    iconBg: 'bg-completed-icon',
    Icon: Check,
    iconColor: 'text-white',
  },
  {
    key: 'wont_do',
    label: "Won't Do",
    iconBg: 'bg-wont-do-icon',
    Icon: X,
    iconColor: 'text-white',
  },
];

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
  mode,
  task,
  boardId,
  isOpen,
  onClose,
  onAfterCreate,
}: TaskDrawerProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<TaskIcon>('person');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [isPending, setIsPending] = useState(false);

  // Sync form when drawer opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && task) {
        setName(task.name);
        setDescription(task.description ?? '');
        setIcon(task.icon);
        setStatus(task.status);
      } else {
        setName('');
        setDescription('');
        setIcon('person');
        setStatus('todo');
      }
    }
  }, [isOpen, mode, task]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsPending(true);
    try {
      const data = {
        name: name.trim(),
        description: description.trim() || undefined,
        icon,
        status,
      };
      if (mode === 'create') {
        if (onAfterCreate) {
          await onAfterCreate(data);
        } else {
          await addTask(boardId, data);
        }
      } else if (mode === 'edit' && task) {
        await updateTask(task._id.toString(), data);
      }
      onClose();
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== 'edit' || !task) return;
    setIsPending(true);
    try {
      await deleteTask(task._id.toString(), boardId);
      onClose();
    } finally {
      setIsPending(false);
    }
  };

  const toggleStatus = (s: TaskStatus) => {
    setStatus((prev) => (prev === s ? 'todo' : s));
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === 'create' ? 'Add New Task' : 'Edit Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {/* Form */}
        <div className="flex-1 px-6 py-4 space-y-5">
          {/* Task name */}
          <div>
            <label className="block text-xs font-medium text-action-secondary mb-1.5">
              Task name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter task name"
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

          {/* Icon picker */}
          <div>
            <label className="block text-xs font-medium text-action-secondary mb-1.5">
              Icon
            </label>
            <div className="flex gap-2 flex-wrap">
              {ICONS.map(({ key, emoji }) => (
                <button
                  key={key}
                  onClick={() => setIcon(key)}
                  className={`w-11 h-11 rounded-lg text-xl flex items-center justify-center transition-colors cursor-pointer ${
                    icon === key
                      ? 'bg-icon-bg-selected'
                      : 'bg-icon-bg-unselected hover:bg-icon-bg-selected'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Status picker */}
          <div>
            <label className="block text-xs font-medium text-action-secondary mb-1.5">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map(({ key, label, iconBg, Icon, iconColor }) => (
                <button
                  key={key}
                  onClick={() => toggleStatus(key)}
                  className={`flex items-center gap-3 px-0.5 py-0.5 rounded-xl border-2 transition-colors text-left cursor-pointer bg-white ${
                    status === key
                      ? 'border-(--color-action-primary)'
                      : 'border-gray-200'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
                  >
                    <Icon size={18} className={iconColor} />
                  </div>
                  <span className="font-medium text-gray-800 flex-1 text-sm">
                    {label}
                  </span>
                  {status === key && (
                    <div className="w-5 h-5 rounded-full bg-(--color-action-primary) flex items-center justify-center shrink-0 mr-2">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Footer buttons */}
        <div className="px-6 py-5 flex justify-end gap-3">
          {mode === 'edit' && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="px-4 py-1 rounded-full text-sm font-medium text-white bg-(--color-action-secondary) hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              Delete <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!name.trim() || isPending}
            className="px-4 py-1 rounded-full text-sm font-medium text-white bg-(--color-action-primary) hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            Save <Check size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
