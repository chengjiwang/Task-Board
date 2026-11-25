// Single source of truth for task icon / status enums and their presentation.
// Consumed by the Mongoose schema, zod validation, TS types and UI components.

export const TASK_ICONS = [
  'person',
  'bubble',
  'coffee',
  'workout',
  'stack',
  'clock',
] as const;
export type TaskIcon = (typeof TASK_ICONS)[number];

export const TASK_STATUSES = [
  'todo',
  'in_progress',
  'completed',
  'wont_do',
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const ICON_EMOJI: Record<TaskIcon, string> = {
  person: '🧑‍💻',
  bubble: '💬',
  coffee: '☕',
  workout: '🏋️‍♂️',
  stack: '📚',
  clock: '⏰',
};

export interface StatusMeta {
  label: string;
  /** Card background class */
  cardBg: string;
  /** Status icon background class (todo has none) */
  iconBg: string | null;
  /** Status icon image (todo has none) */
  iconSrc: string | null;
}

// Class names are written out in full so Tailwind can detect them.
export const STATUS_META: Record<TaskStatus, StatusMeta> = {
  todo: { label: 'To Do', cardBg: 'bg-todo-bg', iconBg: null, iconSrc: null },
  in_progress: {
    label: 'In Progress',
    cardBg: 'bg-in-progress-bg',
    iconBg: 'bg-in-progress-icon',
    iconSrc: '/icons/time_atack_duotone.svg',
  },
  completed: {
    label: 'Completed',
    cardBg: 'bg-completed-bg',
    iconBg: 'bg-completed-icon',
    iconSrc: '/icons/done_round_duotone.svg',
  },
  wont_do: {
    label: "Won't Do",
    cardBg: 'bg-wont-do-bg',
    iconBg: 'bg-wont-do-icon',
    iconSrc: '/icons/close_ring_duotone.svg',
  },
};

/** Statuses selectable in the drawer (todo is the "none selected" state). */
export const SELECTABLE_STATUSES = TASK_STATUSES.filter((s) => s !== 'todo');
