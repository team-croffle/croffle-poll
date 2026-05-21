import { eq } from 'drizzle-orm';

import { db } from '~~/server/utils/db';
import { users } from '~~/server/utils/schema';
import type { ProfileUpdateRequestDto } from '~~/shared/dto';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) {
    throw createError({ statusCode: 401, message: '인증이 필요합니다.' });
  }

  const { nickname } = await readBody<ProfileUpdateRequestDto>(event);
  if (!nickname || nickname.trim() === '') {
    throw createError({ statusCode: 400, message: '닉네임을 입력해 주세요.' });
  }

  // 1. DB 닉네임 업데이트
  await db
    .update(users)
    .set({
      nickname: nickname.trim(),
    })
    .where(eq(users.id, session.user.id));

  // 2. 현재 사용자 세션 동기화
  await setUserSession(event, {
    user: {
      ...session.user,
      nickname: nickname.trim(),
    },
  });

  return { success: true };
});
