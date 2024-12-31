import "dotenv/config"
import { Request, Response } from 'express';
import { getClicksByDate, getDeviceStats, getOverallStats, getTopicStats, getTotalClicks, getUniqueUsers } from "../services/analytics";
import { findLongUrl } from "../services/urlService";
import { findUserByEmail, getUserId } from "../services/userService";

const handleAnalytics = async (req: Request, res: Response) => {
    try {
        const alias = req.params.alias
        if (!alias) {
            res.status(400).json({ message: "No short_url provided in the params" })
            return
        }
        const short_url_exists = await findLongUrl(alias);
        if (!short_url_exists.success) {
            res.status(404).json({ message: "Short URL not found" })
            return
        }

        const totalClicks = await getTotalClicks(alias)
        const uniqueUsers = await getUniqueUsers(alias)
        const clicksByDate = await getClicksByDate(alias)
        const stats = await getDeviceStats(alias)
        const osType = stats?.osData
        const deviceType = stats?.deviceData
        // console.log({
        //     total_clicks,
        //     unique_users,
        //     clicks_by_date,
        // })
        // console.log(stats?.osData)
        // console.log(stats?.deviceData)

        res.status(200).json({ totalClicks, uniqueUsers, clicksByDate, osType, deviceType })
        console.log("[SERVER] Analytics Data sent ✔️")
    }
    catch (error) {
        console.log("[SERVER] Error handling Analytics :", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const handleTopicAnalytics = async (req: Request, res: Response) => {
    try {
        const topic = req.params.topic
        if (!topic) {
            res.status(400).json({ message: "No short_url provided in the params" })
            return
        }
        const topic_stats = await getTopicStats(topic);
        if (topic_stats === 0) {
            res.status(404).json({ message: "Topic stats not found" })
            return
        }

        res.status(200).json(topic_stats)
        console.log("[SERVER] Topic Analytics Data sent ✔️")

    }
    catch (error) {
        console.log("[SERVER] Error handling Topic Analytics :", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const handleOverallAnalytics = async (req: Request, res: Response) => {

    try {
        const user = req.user as { email?: string }; // Type-casting the payload
        const userEmail = user?.email;
        if (!userEmail) {
            res.status(400).json({ message: 'User email not found in token' });
            return;
        }

        const user_id = await getUserId(userEmail)

        if (!user_id.success) {
            res.status(404).json({ message: user_id.message })
            return
        }

        const overall_stats = await getOverallStats(user_id.data!)

        if (overall_stats === 0) {
            res.status(404).json({ message: "Overall stats not found" })
            return
        }

        res.status(200).json(overall_stats)
        console.log("[SERVER] Overall Analytics sent for user :", userEmail)

    }
    catch (error) {
        console.log("[SERVER] Error handling Overall Analytics :", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export { handleAnalytics, handleTopicAnalytics, handleOverallAnalytics }
