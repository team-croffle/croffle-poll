import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) throw createError({ statusCode: 401 });

  const user = session.user as {
    id: number;
    email: string;
    name: string;
    role: 'ADMIN' | 'MEMBER';
  };

  if (user.role !== 'ADMIN') throw createError({ statusCode: 403 });

  const { userId } = await readBody(event);

  if (!userId) throw createError({ statusCode: 400, message: 'User ID is required' });

  await db.delete(users).where(eq(users.id, userId));

  return { success: true };
});
