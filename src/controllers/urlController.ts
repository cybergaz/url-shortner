import "dotenv/config"
import { Request, Response } from 'express';
import { ShortenUrlRequest } from '../types/types';
import { getUserId } from "../services/userService";
import { createAliasedShortUrl, createShortUrl, findLongUrl } from "../services/urlService";
import { createLogs, fetchGeoLocation } from "../services/analytics";

const handleShort = async (req: Request<{}, {}, ShortenUrlRequest>, res: Response) => {
    const user = req.user as { email?: string }; // Type-casting the payload
    const userEmail = user?.email;
    // console.log("[SERVER] User Email:", userEmail)
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
    try {
        const alias = req.params.alias
        if (!alias) {
            res.status(400).json({ message: "no alias provided in the params" })
        }

        const results = await findLongUrl(alias)
        if (!results.success) {
            res.status(400).json({ message: results.message })
            return;
        }

        const ip = req.ip!
        const userAgent = req.headers['user-agent'] || "Unknown User-Agent";
        // const { browser, cpu, device, os } = UAParser(userAgent);
        // Fetch geolocation data using an API
        // const geolocation = await fetchGeoLocation(ip);

        // Log the details
        // console.log(`[Redirect Log]`, {
        //     userAgent,
        //     ip,
        // });

        await createLogs(ip, userAgent, alias)

        res.redirect(results.data?.long_url!)
        console.log("[SERVER] redirecting user to :", results.data)
    }
    catch (error) {
        console.error("[SERVER] Error Occured while processing long url:", error)
        res.status(500).json({ message: "An internal error occurred" });
    }
}

export { handleShort, handleShortRedirect };
