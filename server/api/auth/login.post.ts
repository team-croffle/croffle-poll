import { eq } from 'drizzle-orm';
import { users } from '~~/server/utils/schema';
import { db } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw createError({ statusCode: 401, message: '아이디 또는 비밀번호가 틀렸습니다.' });
  }

  // 세션에 유저 정보 저장
  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role, // 'ADMIN' 또는 'MEMBER'
    },
  });

  return { success: true };
});
