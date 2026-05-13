import { pgEnum, pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'USER']);

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  loginId: varchar('login_id', { length: 50 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  nickname: varchar('nickname', { length: 50 }).notNull(),
  role: userRoleEnum('role').default('USER').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
