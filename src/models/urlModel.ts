import { pgTable, text, varchar, serial, integer, jsonb, timestamp, inet, foreignKey } from 'drizzle-orm/pg-core';
import { users } from './userModel';


// Short URLs Table
const shortUrls = pgTable('short_urls', {
    id: serial('id').primaryKey(),
    long_url: text('long_url').notNull(),
    short_url: varchar('short_url', { length: 255 }).unique().notNull(),
    custom_alias: varchar('custom_alias', { length: 255 }),
    topic: varchar('topic', { length: 50 }),
    user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    created_at: timestamp('created_at').defaultNow(),
});


const rateLimits = pgTable('rate_limits', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    url_creation_count: integer('url_creation_count').default(0),
    last_reset: timestamp('last_reset').defaultNow(),
    reset_interval: varchar('reset_interval', { length: 50 }).default('1 day'),
});







export { shortUrls, rateLimits }
