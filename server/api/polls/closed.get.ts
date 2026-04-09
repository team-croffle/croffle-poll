import { desc, eq } from 'drizzle-orm';
import { db } from '~~/server/utils/db';
import { polls, users } from '~~/server/utils/schema';

export default defineEventHandler(async (_) => {
  // 최신 투표가 위로 오도록 desc ordering
  const allPolls = await db
    .select()
    .from(polls)
    .innerJoin(users, eq(polls.creatorId, users.id))
    .where(eq(polls.isClosed, true))
    .orderBy(desc(polls.createdAt));

  const formattedPolls = allPolls.map((poll) => ({
    id: poll.polls.id,
    title: poll.polls.title,
    description: poll.polls.description,
    creatorName: poll.users.name,
    isAnonymous: poll.polls.isAnonymous,
    isMultipleChoice: poll.polls.isMultipleChoice,
    allowCustomOptions: poll.polls.allowCustomOptions,
    optionType: poll.polls.optionType,
    isClosed: poll.polls.isClosed,
    createdAt: poll.polls.createdAt,
  }));

  return formattedPolls;
});
