'use client';

import Image from 'next/image';

interface AddTaskButtonProps {
  onClick: () => void;
}

export default function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-xl bg-(--color-add-task-bg) hover:brightness-95 transition-all cursor-pointer text-left"
    >
      <div className="w-10 h-10 rounded-lg bg-(--color-add-task-icon) flex items-center justify-center text-white text-xl font-bold shrink-0">
        <Image
          src="/icons/add_round_duotone.svg"
          alt="add task"
          width={20}
          height={20}
        />
      </div>
      <span className="font-semibold text-gray-700">Add new task</span>
    </button>
  );
}
