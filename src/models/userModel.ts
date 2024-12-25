import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { db } from "../config/database";
import { eq } from "drizzle-orm";

const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
});

const createUser = async (email: string) => {
    try {
        const user = await findUserByEmail(email);
        if (user.length > 0) {
            console.log("[DATABASE] User Already REGISTERED, Please LOGIN To Continue");
            console.error("[DATABASE] Aborting Query ✖️");
            return;
        }
        else {
            console.log("[DATABASE] Creating New User....");
            const new_user = await db.insert(users).values({ email }).returning();
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

