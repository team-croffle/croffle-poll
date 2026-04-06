import { db } from '~~/server/utils/db';
import { users } from '~~/server/utils/schema';

export default defineEventHandler(async (event) => {
  // 현재 세션 확인
  const session = await getUserSession(event);
  if (!session.user) {
    throw createError({ statusCode: 401, message: '인증이 필요합니다.' });
  }

  const user = session.user as {
    id: number;
    email: string;
    name: string;
    role: 'ADMIN' | 'MEMBER';
  };

  if (user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, message: '팀장만 계정을 생성할 수 있습니다.' });
  }

  const { email, password, name } = await readBody(event);

  const hashedPassword = await hashPassword(password);

  // 비밀번호 해싱 후 저장
  await db.insert(users).values({
    email,
    name,
    passwordHash: hashedPassword,
    role: 'MEMBER',
  });

  return { success: true };
});
