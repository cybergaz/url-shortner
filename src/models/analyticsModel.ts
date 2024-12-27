import { pgTable, text, varchar, serial, integer, jsonb, timestamp, inet, foreignKey } from 'drizzle-orm/pg-core';
import { users } from './userModel';
import { shortUrls } from './urlModel';

const redirectLogs = pgTable('redirect_logs', {
    id: serial('id').primaryKey(),
    short_url_id: integer('short_url_id').references(() => shortUrls.id, { onDelete: 'cascade' }),
    user_agent: varchar('user_agent', { length: 255 }),
    ip_address: inet('ip_address'),
    os_type: varchar('os_type', { length: 50 }),
    device_type: varchar('device_type', { length: 50 }),
    geolocation: jsonb('geolocation'),
    created_at: timestamp('created_at').defaultNow(),
});

const urlAnalytics = pgTable('url_analytics', {
    id: serial('id').primaryKey(),
    short_url_id: integer('short_url_id').references(() => shortUrls.id, { onDelete: 'cascade' }),
    total_clicks: integer('total_clicks').default(0),
    unique_users: integer('unique_users').default(0),
    clicks_by_date: jsonb('clicks_by_date'),
    os_type: jsonb('os_type'),
    device_type: jsonb('device_type'),
    updated_at: timestamp('updated_at').defaultNow(),
});

const topicAnalytics = pgTable('topic_analytics', {
    id: serial('id').primaryKey(),
    topic: varchar('topic', { length: 50 }),
    total_clicks: integer('total_clicks').default(0),
    unique_users: integer('unique_users').default(0),
    clicks_by_date: jsonb('clicks_by_date'),
    urls: jsonb('urls'),
    updated_at: timestamp('updated_at').defaultNow(),
});

export { redirectLogs, urlAnalytics, topicAnalytics }


