import { getBoards } from '@/lib/actions/boardActions';
import BoardListPage from '@/components/boards/BoardListPage';

export default async function Home() {
  const boards = await getBoards();
  return <BoardListPage boards={boards} />;
}
