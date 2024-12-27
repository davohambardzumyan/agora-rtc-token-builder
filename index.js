import {config} from "dotenv";
import express from "express"
import RTCTokenController from "./Controllers/RTCTokenController.js";
import AndroidSubbscription from "./Controllers/AndroidSubbscription.js";
import IosSubbscription from "./Controllers/IosSubbscription.js";
import TikTokController from "./Controllers/TikTokController.js";
import TikTokCollbackController from "./Controllers/TikTokCollbackController.js";
import SpotifyController from "./Controllers/SpotifyController.js";

config();
const app = express();
app.use(express.json());

global.env = process.env;

app.post(AndroidSubbscription.route, AndroidSubbscription.handler);
app.post(IosSubbscription.route, IosSubbscription.handler);
app.post(RTCTokenController.route, RTCTokenController.handler);
app.post(TikTokController.route, TikTokController.handler);
app.get(TikTokCollbackController.route, TikTokController.handler);
app.get(TikTokCollbackController.route, TikTokController.handler);
app.get(SpotifyController.route, SpotifyController.handler);

app.listen(env.APP_PORT, () => {
    console.log(`Token server listening at http://localhost:${env.APP_PORT}`);
});

