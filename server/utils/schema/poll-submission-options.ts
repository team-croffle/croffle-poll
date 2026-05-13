import { primaryKey, pgTable, uuid } from 'drizzle-orm/pg-core';
import { pollOptions } from './poll-options';
import { pollSubmissions } from './poll-submissions';

export const pollSubmissionOptions = pgTable(
  'poll_submission_options',
  {
    submissionId: uuid('submission_id')
      .notNull()
      .references(() => pollSubmissions.id, { onDelete: 'cascade' }),
    optionId: uuid('option_id')
      .notNull()
      .references(() => pollOptions.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.submissionId, t.optionId] }),
  })
);
