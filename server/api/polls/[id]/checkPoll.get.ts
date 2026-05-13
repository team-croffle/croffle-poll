import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const pollId = event.context.params?.id;
  if (!pollId) throw createError({ statusCode: 400, message: '투표 ID가 필요합니다.' });

  const session = await getUserSession(event);

  if (!session.user) throw createError({ statusCode: 401 });

  return await db.transaction(async (tx) => {
    const pollResponseExsting = await tx.query.pollSubmissions.findFirst({
      where: (pollSubmissions, { and, eq }) =>
        and(eq(pollSubmissions.pollId, pollId), eq(pollSubmissions.userId, session.user!.id)),
    });

    return { hasSubmited: !!pollResponseExsting };
  });
});
