'use client';

import type { ITask, TaskIcon, TaskStatus } from '@/types';
import { Check, Clock, X } from 'lucide-react';

const ICON_MAP: Record<TaskIcon, string> = {
  clock: '⏰',
  bubble: '💬',
  coffee: '☕',
  workout: '🏋️‍♂️',
  stack: '📚',
  person: '🧑‍💻',
};

const STATUS_STYLES: Record<
  TaskStatus,
  { card: string; iconBg: string | null }
> = {
  todo: { card: 'bg-[var(--color-todo-bg)]', iconBg: null },
  in_progress: {
    card: 'bg-(--color-in-progress-bg)',
    iconBg: 'bg-(--color-in-progress-icon)',
  },
  completed: {
    card: 'bg-(--color-completed-bg)',
    iconBg: 'bg-(--color-completed-icon)',
  },
  wont_do: {
    card: 'bg-(--color-wont-do-bg)',
    iconBg: 'bg-(--color-wont-do-icon)',
  },
};

function StatusIcon({ status }: { status: TaskStatus }) {
  if (status === 'todo') return null;
  const { iconBg } = STATUS_STYLES[status];
  return (
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
    >
      {status === 'in_progress' && <Clock size={18} className="text-white" />}
      {status === 'completed' && <Check size={18} className="text-white" />}
      {status === 'wont_do' && <X size={18} className="text-white" />}
    </div>
  );
}

interface TaskCardProps {
  task: ITask;
  onClick: (task: ITask) => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const { card } = STATUS_STYLES[task.status];

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer hover:brightness-95 transition-all ${card}`}
      onClick={() => onClick(task)}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl shrink-0 shadow-sm">
        {ICON_MAP[task.icon]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-xl truncate">
          {task.name}
        </p>
        {task.description && (
          <p className="text-sm text-gray-600 mt-0.5 line-clamp-1">
            {task.description}
          </p>
        )}
      </div>

      {/* Status icon */}
      <StatusIcon status={task.status} />
    </div>
  );
}
