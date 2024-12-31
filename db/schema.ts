import { 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  jsonb,
  integer 
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Supabase user ID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull(),
  status: text('status', { enum: ['active', 'cancelled'] }).notNull().default('active'),
  plan: text('plan', { enum: ['unlimited'] }).notNull().default('unlimited'),
  creditsUsed: integer('credits_used').notNull().default(0),
  creditsLimit: integer('credits_limit').notNull().default(1000000), // Unlimited for now
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const generatedContent = pgTable('generated_content', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull(),
  prompt: text('prompt').notNull(),
  platform: text('platform', { enum: ['instagram', 'twitter'] }).notNull(),
  captions: jsonb('captions').notNull().$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}); 