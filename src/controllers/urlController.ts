import "dotenv/config"
import { Request, Response } from 'express';


const handleShort = async (req: Request, res: Response) => {

    const { url, alias, topic } = req.body;

}

const handleShortRedirect = async (req: Request, res: Response) => {
}

export { handleShort, handleShortRedirect };
