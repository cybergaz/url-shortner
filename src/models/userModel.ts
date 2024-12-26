import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { db } from "../config/database";
import { eq } from "drizzle-orm";

const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    refresh_token: text("refresh_token"),
});

const createUser = async (email: string, name?: string, refresh_token?: string) => {
    try {
        const user = await findUserByEmail(email);
        if (user.length > 0) {
            console.error("[DATABASE] Aborting Query ✖️");
            console.log("[DATABASE] User Already REGISTERED, Continuing with previous data....");
            return;
        }
        else {
            console.log("[DATABASE] Creating New User....");
            const new_user = await db.insert(users).values({ email, name, refresh_token }).returning();
            console.log("[DATABASE] New User REGISTERED ✔️");
            return new_user;
        }
    }
    catch (error) {
        console.error("[DATABASE] Error Creating User:", error);
    }
};

const findUserByEmail = async (email: string) => {
    return await db.select().from(users).where(eq(users.email, email));
};

export { users, createUser, findUserByEmail };

