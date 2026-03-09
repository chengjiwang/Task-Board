'use client';

import AddTaskButton from '@/components/board/AddTaskButton';
import TaskCard from '@/components/board/TaskCard';
import TaskDrawer from '@/components/task/TaskDrawer';
import { addTask } from '@/lib/actions/taskActions';
import type { ITask, TaskIcon, TaskStatus } from '@/types';
import { startTransition, useOptimistic, useState } from 'react';

interface TaskListProps {
  boardId: string;
  tasks: ITask[];
  onTaskClick: (task: ITask) => void;
}

export default function TaskList({
  boardId,
  tasks,
  onTaskClick,
}: TaskListProps) {
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state, newTask: ITask) => [...state, newTask],
  );
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  const handleCreateTask = (data: {
    name: string;
    description?: string;
    icon: TaskIcon;
    status: TaskStatus;
  }) => {
    const tempTask: ITask = {
      _id: 'temp-' + Date.now(),
      boardId,
      order: optimisticTasks.length,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    startTransition(async () => {
      addOptimisticTask(tempTask);
      await addTask(boardId, data);
    });
  };

  return (
    <>
      <div className="space-y-3">
        {optimisticTasks.length === 0 && (
          <p className="text-center text-gray-400 py-8 text-sm">
            No tasks yet. Click &ldquo;+ Add new task&rdquo; to get started.
          </p>
        )}
        {optimisticTasks.map((task) => (
          <TaskCard
            key={task._id.toString()}
            task={task}
            onClick={onTaskClick}
          />
        ))}
        <AddTaskButton onClick={() => setCreateDrawerOpen(true)} />
      </div>

      <TaskDrawer
        mode="create"
        boardId={boardId}
        isOpen={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        onAfterCreate={handleCreateTask}
      />
    </>
  );
}
