import express from 'express';
import { db } from "./config/database"
import { users, createUser, findUserByEmail } from './models/userModel';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes';
import urlRoutes from './routes/urlRoutes';
import { shortUrls } from './models/urlModel';

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// initialize the auth routes
app.use('/auth', authRoutes);

app.use('/api', urlRoutes)


const initiateServer = async () => {
    try {

        // printing table's initial state
        console.table(await db.select().from(users))
        console.table(await db.select().from(shortUrls))

        app.listen(PORT, () => {
            console.log(`[SERVER] Server Running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("[SERVER] Error Starting The Server:", error);
    }
};
export { app }

initiateServer();
