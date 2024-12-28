import { pgTable, text, varchar, serial, integer, jsonb, timestamp, inet, foreignKey } from 'drizzle-orm/pg-core';
import { users } from './userModel';
import { nanoid } from 'nanoid';
import { db } from '../config/database';
import { CommonResult, ShortUrlResult } from '../types/types';
import { eq } from 'drizzle-orm';


// Short URLs Table
const shortUrls = pgTable('short_urls', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    long_url: text('long_url').notNull(),
    short_url: varchar('short_url', { length: 255 }).unique().notNull(),
    topic: varchar('topic', { length: 50 }),
    created_at: timestamp('created_at').defaultNow(),
});


const rateLimits = pgTable('rate_limits', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    url_creation_count: integer('url_creation_count').default(0),
    last_reset: timestamp('last_reset').defaultNow(),
    reset_interval: varchar('reset_interval', { length: 50 }).default('1 day'),
});


const createShortUrl = async (user_id: number, long_url: string, topic?: string): Promise<CommonResult> => {
    try {
        // Check if the long URL already exists in the database
        // const url_exists = await db.$count(shortUrls, eq(shortUrls.long_url, long_url)) > 0;
        const existing_urls = await db.select().from(shortUrls).where(eq(shortUrls.long_url, long_url));

        if (existing_urls.length > 0) {
            console.log("[DATABASE] Aborting Query. URL already shortened ✖️")
            return {
                success: true,
                message: `[DATABASE] Long URL already shortened ✔️ `,
                data: { short_url: existing_urls[0].short_url, created_at: existing_urls[0].created_at },
            };
        }

        // If not found, create a new short URL
        const randomId = nanoid(6);
        const data_inseted = await db.insert(shortUrls).values({ short_url: randomId, long_url, topic, user_id }).returning();

        let message: string;
        if (topic)
            message = `[DATABASE] Short URL created successfully ✔️ : ${randomId} with topic: ${topic}`;
        else
            message = `[DATABASE] Short URL created successfully ✔️ : ${randomId}`;

        console.log(message)
        return { success: true, message: message, data: { short_url: data_inseted[0].short_url, created_at: data_inseted[0].created_at }, };

    } catch (error) {
        console.error('[DATABASE] Error handling short URL:', error);
        return { success: false, message: 'Unexpected error occurred.' };
    }
};


const createAliasedShortUrl = async (
    user_id: number,
    long_url: string,
    custom_alias: string,
    topic?: string
): Promise<CommonResult> => {
    try {
        // Attempt to insert the custom alias into the database
        const data_inseted = await db.insert(shortUrls).values({ short_url: custom_alias, long_url, topic, user_id }).returning();

        let message: string;
        if (topic)
            message = `[DATABASE] Short URL created successfully ✔️ : ${custom_alias} with topic: ${topic}`
        else
            message = `[DATABASE] Short URL created successfully ✔️ : ${custom_alias}`;

        console.log(message)
        return {
            success: true,
            message: message,
            data: {
                short_url: data_inseted[0].short_url,
                created_at: data_inseted[0].created_at
            }
        };

    } catch (error: any) {
        if (error.code === '23505') { // PostgreSQL unique violation error code
            console.log("[DATABASE] Aborting Query. duplicate alias detected ✖️")
            return { success: false, message: 'Conflict detected: Custom alias already exists. Retry with a different alias' };
        } else {
            return { success: false, message: 'Unexpected error occurred.' };
        }
    }
};

export { shortUrls, rateLimits, createShortUrl, createAliasedShortUrl }
