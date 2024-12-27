import express from "express";
import axios from "axios";

const app = express();

const CLIENT_KEY = "awno2kcens1vaa4g"; // Replace with your TikTok Client Key
const CLIENT_SECRET = "FG9zD37gqNi1CRI1XmFxZFiNrpa3wlMm"; // Replace with your TikTok Client Secret
const REDIRECT_URI = "http://localhost:3000/callback"; // Replace with your redirect URI

// Step 1: Redirect user to TikTok authorization page

export default {
    route:'/auth',
    handler: (req,res) => {
        console.log(res.status)
        console.log(req)
        app.get("/auth", (req, res) => {
            console.log(444)
            const authUrl = `https://www.tiktok.com/v2/auth/authorize?client_key=${CLIENT_KEY}&response_type=code&scope=user.info.basic&redirect_uri=${encodeURIComponent(
                REDIRECT_URI
            )}&state=uniqueState123`;
            console.log(authUrl)
            return res.redirect(authUrl);
        });

    }
}