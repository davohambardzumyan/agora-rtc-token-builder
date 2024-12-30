import SpotifyWebApi from "spotify-web-api-node"
import qs from 'qs';
import axios from 'axios';


export default{
    route:'/spotify-callback',
    handler:async (req, res) => {
        console.log(req,res)
    }
}