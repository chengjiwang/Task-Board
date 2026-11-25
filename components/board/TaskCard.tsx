'use client';

import { ICON_EMOJI, STATUS_META } from '@/lib/constants';
import type { ITask, TaskStatus } from '@/types';
import Image from 'next/image';

function StatusIcon({ status }: { status: TaskStatus }) {
  const { iconBg, iconSrc, label } = STATUS_META[status] ?? STATUS_META.todo;
  if (!iconBg || !iconSrc) return null;
  return (
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
    >
      <Image src={iconSrc} alt={label} width={20} height={20} />
    </div>
  );
}

interface TaskCardProps {
  task: ITask;
  onClick: (task: ITask) => void;
  disabled?: boolean;
}

export default function TaskCard({
  task,
  onClick,
  disabled = false,
}: TaskCardProps) {
  const { cardBg } = STATUS_META[task.status] ?? STATUS_META.todo;

  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 p-4 rounded-2xl text-left transition-all ${cardBg} ${
        disabled
          ? 'opacity-60 pointer-events-none'
          : 'cursor-pointer hover:brightness-95'
      }`}
      disabled={disabled}
      onClick={() => onClick(task)}
    >
      {/* Icon */}
      <div
        aria-hidden="true"
        className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl shrink-0 shadow-sm"
      >
        {ICON_EMOJI[task.icon]}
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
    </button>
  );
}
