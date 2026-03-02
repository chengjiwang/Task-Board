import type { IBoard } from '@/types';
import BoardCard from './BoardCard';
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

        {boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-500 text-lg mb-4">No boards yet</p>
            <CreateBoardButton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <BoardCard key={board._id.toString()} board={board} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
