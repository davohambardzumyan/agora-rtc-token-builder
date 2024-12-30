import express from "express";
import axios from "axios";

const app = express();



export default {
    route: '/tiktok-get-user-data',
    handler: async (req, res) => {

         const {data} = await axios.get('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url', {
            headers: {
              Authorization: `Bearer ${req.query.access_token}`
            }
        })
        return res.send(data.data);
        
    }
}
