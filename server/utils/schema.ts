import { pgTable, serial, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';

// 사용자 (Users)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('MEMBER'), // 'ADMIN' | 'MEMBER'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 투표 메인 (Polls)
export const polls = pgTable('polls', {
  id: serial('id').primaryKey(),
  creatorId: integer('creator_id')
    .references(() => users.id)
    .notNull(),
  title: text('title').notNull(),
  description: text('description'),

  // 투표 속성 플래그
  isAnonymous: boolean('is_anonymous').notNull().default(false), // 기명/무기명
  isMultipleChoice: boolean('is_multiple_choice').notNull().default(false), // 단일/다중 투표
  allowCustomOptions: boolean('allow_custom_options').notNull().default(false), // 직접 항목 작성 허용 여부

  // 데이터 타입 ('TEXT' | 'DATETIME')
  optionType: text('option_type').notNull().default('TEXT'),

  isClosed: boolean('is_closed').notNull().default(false), // 투표 마감 여부
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 투표 항목 (Poll Options)
export const pollOptions = pgTable('poll_options', {
  id: serial('id').primaryKey(),
  pollId: integer('poll_id')
    .references(() => polls.id, { onDelete: 'cascade' })
    .notNull(),

  // 항목 작성자 (관리자가 미리 만들어둔 건 null, '직접 항목 작성'으로 유저가 추가한 건 userId)
  createdBy: integer('created_by').references(() => users.id),

  // 내용 (TEXT 타입이면 일반 문자열, DATETIME이면 ISO 시간 문자열 저장 후 프론트에서 파싱)
  value: text('value').notNull(),
});

// 투표 참여 결과 (Poll Responses)
export const pollResponses = pgTable('poll_responses', {
  id: serial('id').primaryKey(),
  pollId: integer('poll_id')
    .references(() => polls.id, { onDelete: 'cascade' })
    .notNull(),
  optionId: integer('option_id')
    .references(() => pollOptions.id, { onDelete: 'cascade' })
    .notNull(),

  // 무기명 투표라도 '중복 투표 방지'를 위해 DB에는 반드시 유저 정보를 남겨야 함.
  // API 응답 시에만 isAnonymous 플래그를 보고 유저 정보를 필터링해서 내려주면 됨.
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
