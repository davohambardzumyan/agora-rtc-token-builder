import express from "express";
import axios from "axios";

const app = express();

// Step 1: Redirect user to TikTok authorization page

export default {
    route:'/tiktok/auth/callback/',
    handler:async (req, res) => {
        const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URL;
        const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
        const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
       const { code } = req.query;
         const tokenResponse = await axios.post(
           "https://open.tiktokapis.com/v2/oauth/token/",
           new URLSearchParams({
             client_key: TIKTOK_CLIENT_KEY,
             client_secret: TIKTOK_CLIENT_SECRET,
             code: code,
             grant_type: "authorization_code",
             redirect_uri: encodeURIComponent(REDIRECT_URI)
           }),
       
           { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
         );
         return res.send(tokenResponse.data)
    }
}