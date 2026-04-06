import { desc } from 'drizzle-orm';
import { db } from '~~/server/utils/db';
import { votes } from '~~/server/utils/schema';

export default defineEventHandler(async (_) => {
  // 최신 투표가 위로 오도록 desc ordering
  const allPolls = await db.select().from(votes).orderBy(desc(votes.createdAt));

  return allPolls;
});
