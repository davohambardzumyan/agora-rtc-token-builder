import {config} from "dotenv";
import express from "express"

config();
const app = express();
app.use(express.json());
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

import RTCTokenController from "./Controllers/RTCTokenController.js";
import AndroidSubbscription from "./Controllers/AndroidSubbscription.js";
import IosSubbscription from "./Controllers/IosSubbscription.js";
import TikTokController from "./Controllers/TikTokController.js";
import TikTokCollbackController from "./Controllers/TikTokCollbackController.js";
import TikTokUserDataController from "./Controllers/TikTokUserDataController.js";
import SpotifyController from "./Controllers/SpotifyController.js";
import SpotifyCallback from "./Controllers/SpotifyCallback.js";



global.env = process.env;

app.post(AndroidSubbscription.route, AndroidSubbscription.handler);
app.post(IosSubbscription.route, IosSubbscription.handler);
app.post(RTCTokenController.route, RTCTokenController.handler);
app.get(TikTokController.route, TikTokController.handler);
app.get(TikTokCollbackController.route, TikTokCollbackController.handler);
app.get(SpotifyController.route, SpotifyController.handler);
app.get(SpotifyCallback.route, SpotifyCallback.handler);
app.get(TikTokUserDataController.route, TikTokUserDataController.handler);




app.listen(env.APP_PORT, () => {
    console.log(`Token server listening at http://localhost:${env.APP_PORT}`);
});

