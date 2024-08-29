import {config} from "dotenv";
import express from "express"
import RTCTokenController from "./Controllers/RTCTokenController.js";

const {parsed:env} = config();
const app = express();
app.use(express.json());

global.env = env;

app.post(RTCTokenController.route,RTCTokenController.handler );

app.listen(env.APP_PORT , () => {
    console.log(`Token server listening at http://localhost:${env.APP_PORT}`);
});

