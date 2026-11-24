import { z } from 'zod';

// Keep in sync with the Mongoose schema enums and the TaskIcon / TaskStatus types.
const TASK_ICONS = [
  'clock',
  'bubble',
  'coffee',
  'workout',
  'stack',
  'person',
] as const;
const TASK_STATUSES = ['todo', 'in_progress', 'completed', 'wont_do'] as const;

// z.object strips unknown keys, so these schemas double as a field whitelist
// (boardId / order / _id / tasks can never be injected through `data`).
export const TaskInput = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),
  icon: z.enum(TASK_ICONS).optional(),
  status: z.enum(TASK_STATUSES).optional(),
});

export const TaskUpdateInput = TaskInput.partial();

export const BoardInput = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),
});

export const BoardUpdateInput = BoardInput.partial();
