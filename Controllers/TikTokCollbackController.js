import express from "express";
import axios from "axios";

const app = express();

const CLIENT_KEY = "awno2kcens1vaa4g"; // Replace with your TikTok Client Key
const CLIENT_SECRET = "FG9zD37gqNi1CRI1XmFxZFiNrpa3wlMm"; // Replace with your TikTok Client Secret

// Step 1: Redirect user to TikTok authorization page

export default {
    route:'/callback',
    handler:async (req, res) => {
        app.get("/callback", async (req, res) => {
            const { code } = req.query;

            if (!code) {
                return res.status(400).send("Authorization code not provided.");
            }

            try {
                // Exchange code for access token
                const tokenResponse = await axios.post(
                    "https://open.tiktokapis.com/v2/oauth/token/",
                    new URLSearchParams({
                        client_key: CLIENT_KEY,
                        client_secret: CLIENT_SECRET,
                        code: code,
                        grant_type: "authorization_code",
                    }),
                    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
                );

                const accessToken = tokenResponse.data.data.access_token;

                // Fetch user profile details
                const userInfoResponse = await axios.get("https://open.tiktokapis.com/v2/user/info/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const avatarUrl = userInfoResponse.data.data.user.avatar_url;
                res.send(`<h1>User Profile Image</h1><img src="${avatarUrl}" alt="Profile Image" />`);
            } catch (error) {
                console.error("Error fetching profile info:", error.response?.data || error.message);
                res.status(500).send("Failed to retrieve profile image.");
            }
        });
    }
}
// app.get("/auth", (req, res) => {
//     const authUrl = `https://www.tiktok.com/v2/auth/authorize?client_key=${CLIENT_KEY}&response_type=code&scope=user.info.basic&redirect_uri=${encodeURIComponent(
//         REDIRECT_URI
//     )}&state=uniqueState123`;
//     res.redirect(authUrl);
// });
//
// // Step 2: Handle TikTok callback and exchange authorization code for access token
// app.get("/callback", async (req, res) => {
//     const { code } = req.query;
//
//     if (!code) {
//         return res.status(400).send("Authorization code not provided.");
//     }
//
//     try {
//         // Exchange code for access token
//         const tokenResponse = await axios.post(
//             "https://open.tiktokapis.com/v2/oauth/token/",
//             new URLSearchParams({
//                 client_key: CLIENT_KEY,
//                 client_secret: CLIENT_SECRET,
//                 code: code,
//                 grant_type: "authorization_code",
//             }),
//             { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//         );
//
//         const accessToken = tokenResponse.data.data.access_token;
//
//         // Fetch user profile details
//         const userInfoResponse = await axios.get("https://open.tiktokapis.com/v2/user/info/", {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });
//
//         const avatarUrl = userInfoResponse.data.data.user.avatar_url;
//         res.send(`<h1>User Profile Image</h1><img src="${avatarUrl}" alt="Profile Image" />`);
//     } catch (error) {
//         console.error("Error fetching profile info:", error.response?.data || error.message);
//         res.status(500).send("Failed to retrieve profile image.");
//     }
// });
//
// // Start the server
// app.listen(3000, () => {
//     console.log("Server running at http://localhost:3000");
// });