import express from "express";
import axios from "axios";

const app = express();


// The redirect URI you set in TikTok Developer Portal
const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URL;
console.log(REDIRECT_URI)
export default {
    route: '/auth/accounts/',
    handler: async (req, res) => {
        const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URL;
        const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
        const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
        // const csrfState = Math.random().toString(36).substring(2);

        const scope = 'user.info.basic,video.list';  // Add required scopes
        const state = generateRandomString(36) // Generate random statec
        // Store state in session/database to verify later
        // req.session.tiktokState = state;
        // Build TikTok authorization URL
        const authUrl = `https://www.tiktok.com/v2/auth/authorize?` +
            `client_key=${TIKTOK_CLIENT_KEY}` +
            `&scope=${scope}` +
            `&response_type=code` +
            `&state=${state}` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        // Return the auth URL to mobile app
        return res.send( authUrl);
        // return res.redirect(authUrl)
    }
}

function generateRandomString(length = 36) {
    let result = '';
    while (result.length < length) {
      result += Math.random().toString(36).substring(2); // Generate random string
    }
    return result.substring(0, length); // Trim to the desired length
  }
  
