import type { IBoard } from '@/types';
import CreateBoardButton from './CreateBoardButton';

interface BoardListPageProps {
  boards: IBoard[];
}

export default function BoardListPage({ boards }: BoardListPageProps) {
  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">All Boards</h1>
          <CreateBoardButton />
        </div>
      </div>
    </div>
  );
}
