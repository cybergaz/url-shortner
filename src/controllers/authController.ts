import "dotenv/config"
import { Request, Response } from 'express';
import { google } from 'googleapis';
import open from 'open';
import { getConsentUrl, getTokens, getUserInfo } from "../services/authService";
import { createUser } from "../models/userModel";


const handleLogin = async (req: Request, res: Response) => {
    const consentUrl = getConsentUrl();

    open(consentUrl).then(() => {
        console.log('[SERVER.AUTH] Opened browser for Google Sign-In. Complete the process there.');
    });

    console.log('[SERVER.AUTH] if the browser window does not appear, visit the following link: "', consentUrl, '"');
    res.send('Opened browser for Google Sign-In. Complete the process there.\nOR\nvisit the following link: "' + consentUrl + '"');
}

const handleGoogleCallback = async (req: Request, res: Response) => {
    const code = req.query.code;

    try {
        if (!code) {
            res.status(400).send('Error: No code provided.');
            return
        }

        if (typeof code !== 'string') {
            res.status(400).send('Invalid code parameter.');
            return
        }

        const { idToken, refreshToken } = await getTokens(code)
        const data = await getUserInfo(idToken)

        if (!data) {
            console.error('[SERVER.AUTH] Error Retrieving User Info.');
            return
        }
        else {
            console.log('[SERVER.AUTH] Logged-in User Info:', data);
            createUser(data.email!, data.name, refreshToken)
        }

        res.send('Authentication successful ✔️ , you can now close this tab.');

    } catch (error) {
        console.error('[SERVER.AUTH] Error exchanging code for tokens:', error);
        res.status(500).send('Error during authentication.');
    }
}

export { handleLogin, handleGoogleCallback }
