import BoardMain from '@/components/board/BoardMain';
import { getBoard } from '@/lib/actions/boardActions';
import { notFound } from 'next/navigation';

interface BoardPageProps {
  params: Promise<{ boardId: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardId } = await params;
  const board = await getBoard(boardId);

  if (!board) {
    notFound();
  }

  return <BoardMain board={board} />;
}
