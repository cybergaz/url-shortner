import "dotenv/config"
import { Request, Response } from 'express';
import { ShortenUrlRequest } from '../types/types';
import { findUserByEmail, getUserId } from "../models/userModel";
import { createAliasedShortUrl, createShortUrl, shortUrls } from "../models/urlModel";


const handleShort = async (req: Request<{}, {}, ShortenUrlRequest>, res: Response) => {
    const user = req.user as { email?: string }; // Type-casting the payload
    const userEmail = user?.email;
    if (!userEmail) {
        res.status(400).json({ message: 'User email not found in token' });
        return;
    }

    const { longUrl, customAlias, topic } = req.body;

    if (!longUrl) {
        res.status(400).json({ error: "LongURL is required" });
        return
    }

    try {
        // console.log("User Email:", userEmail);
        const results = await getUserId(userEmail);
        if (!results.success) {
            res.status(404).json({ message: results.message });
            return;
        }
        const user_id = results.data!

        if (customAlias) {
            // custom alias logic
            const results = await createAliasedShortUrl(user_id, longUrl, customAlias, topic)
            if (!results.success) {
                res.status(400).json({ message: results.message });
                return;
            }
            // on successfull creation of custom alias
            res.status(201).json({ message: results.message, shortUrl: results.data.short_url, createdAt: results.data.created_at });
            return;
        }

        // shortening logic
        const results_n = await createShortUrl(user_id, longUrl, topic)
        if (!results_n.success) {
            res.status(400).json({ message: results_n.message });
            return;
        }
        // on successfull creation of short url
        res.status(201).json({ message: results_n.message, shortUrl: results_n.data.short_url, createdAt: results_n.data.created_at });

    }
    catch (error) {
        console.error("[SERVER] Error Shortening Url:", error);
        res.json({ message: `URL Shortening Failed ✖️ , check logs` });
        return
    }

    // Use the email for your logic

    // Your shortening logic here

}

const handleShortRedirect = async (req: Request, res: Response) => {
}

export { handleShort, handleShortRedirect };
