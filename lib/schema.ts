import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const practitioners = pgTable('practitioners', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  specialism: text('specialism').notNull(),
  location: text('location').notNull(),
  tier: text('tier').notNull(), // 'standard' or 'premium'
  createdAt: timestamp('created_at').defaultNow(),
});