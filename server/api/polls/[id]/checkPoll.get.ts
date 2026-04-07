import { and, eq } from 'drizzle-orm';
import { pollResponses } from '~~/server/utils/schema';

export default defineEventHandler(async (event) => {
  const pollId = Number(event.context.params?.id);

  return await db.transaction(async (tx) => {
    const session = await getUserSession(event);
    if (!session.user) throw createError({ statusCode: 401 });
    const user = session.user as {
      id: number;
      email: string;
      name: string;
      role: 'ADMIN' | 'MEMBER';
    };
    const userId = user.id;

    const existingPolls = await tx
      .select()
      .from(pollResponses)
      .where(and(eq(pollResponses.pollId, pollId), eq(pollResponses.userId, userId)));

    return { hasPolld: existingPolls.length > 0 };
  });
});
