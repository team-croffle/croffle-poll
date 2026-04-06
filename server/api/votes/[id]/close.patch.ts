import { eq, and } from 'drizzle-orm';
import { db } from '~~/server/utils/db';
import { votes } from '~~/server/utils/schema';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) throw createError({ statusCode: 401 });

  const user = session.user as {
    id: number;
    email: string;
    name: string;
    role: 'ADMIN' | 'MEMBER';
  };

  const pollId = Number(event.context.params?.id);

  // 작성자 본인인지 확인하기 위해 조건에 creatorId 추가
  const result = await db
    .update(votes)
    .set({ isClosed: true })
    .where(
      and(
        eq(votes.id, pollId),
        eq(votes.creatorId, user.id) // 내 투표만 마감할 수 있음
      )
    )
    .returning();

  if (result.length === 0) {
    throw createError({ statusCode: 403, message: '권한이 없거나 존재하지 않는 투표입니다.' });
  }

  return { success: true };
});
