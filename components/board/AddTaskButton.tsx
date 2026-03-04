'use client';

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
        +
      </div>
      <span className="font-semibold text-gray-700">Add new task</span>
    </button>
  );
}
