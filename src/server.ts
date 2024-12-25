import express from 'express';
import { db } from "./config/database"
import { users, createUser, findUserByEmail } from './models/userModel';
import 'dotenv/config';

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});


const initiateServer = async () => {
    try {

        // console.table(await db`SELECT * FROM polls`)
        // const user = await createUser("testmalio@gmail.com")
        // if (user) {
        //     console.log("[DATABASE] Registered User: ", user)
        // }
        //
        const data = await db.select().from(users)
        console.table(data)

        app.listen(PORT, () => {
            console.log(`[SERVER] Server Running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("[SERVER] Error Starting The Server:", error);
    }
};

initiateServer();
