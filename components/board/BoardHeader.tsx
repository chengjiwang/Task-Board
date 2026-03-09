'use client';

import Image from 'next/image';

interface BoardHeaderProps {
  name: string;
  onEditClick: () => void;
}

export default function BoardHeader({ name, onEditClick }: BoardHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Image src="/icons/Logo.svg" alt="Logo" width={40} height={40} />
      <h1 className="text-4xl font-bold text-gray-900">{name}</h1>
      <button
        onClick={onEditClick}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        aria-label="Edit board"
      >
        <Image src="/icons/Edit_duotone.svg" alt="" width={24} height={24} />
      </button>
    </div>
  );
}
