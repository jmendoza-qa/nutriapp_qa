import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ViewDishDetail from './ViewDishDetail';

export default async function ViewDishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session || !session.value) {
    redirect('/login');
  }
  return <ViewDishDetail id={id} />;
}
