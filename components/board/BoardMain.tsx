'use client';

import BoardEditDrawer from '@/components/board/BoardEditDrawer';
import BoardHeader from '@/components/board/BoardHeader';
import TaskList from '@/components/board/TaskList';
import TaskDrawer from '@/components/task/TaskDrawer';
import type { IBoard, ITask } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface BoardMainProps {
  board: IBoard;
}

export default function BoardMain({ board }: BoardMainProps) {
  const boardId = board._id.toString();
  const tasks = board.tasks as unknown as ITask[];

  // TaskDrawer (edit mode)
  const [editTaskDrawerOpen, setEditTaskDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | undefined>(
    undefined,
  );

  const [boardEditDrawerOpen, setBoardEditDrawerOpen] = useState(false);

  const handleTaskClick = (task: ITask) => {
    setSelectedTask(task);
    setEditTaskDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          All Boards
        </Link>

        <BoardHeader
          name={board.name}
          onEditClick={() => setBoardEditDrawerOpen(true)}
        />

        {board.description && (
          <p className="text-gray-800 text-base mb-6 ml-14 -mt-3">
            {board.description}
          </p>
        )}

        <TaskList
          boardId={boardId}
          tasks={tasks}
          onTaskClick={handleTaskClick}
        />
      </div>

      <BoardEditDrawer
        board={board}
        isOpen={boardEditDrawerOpen}
        onClose={() => setBoardEditDrawerOpen(false)}
      />

      {/* TaskDrawer — edit mode */}
      <TaskDrawer
        mode="edit"
        task={selectedTask}
        boardId={boardId}
        isOpen={editTaskDrawerOpen}
        onClose={() => {
          setEditTaskDrawerOpen(false);
          setSelectedTask(undefined);
        }}
      />
    </div>
  );
}
