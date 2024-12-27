import SpotifyWebApi from "spotify-web-api-node"
import qs from 'qs';
import axios from 'axios';


export default{
    route:'/spotify-get-access-token',
    handler:async (req, res) => {
        const client_id = process.env.SPOTIFY_CLIENT_ID;
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

        const data = qs.stringify({'grant_type':'client_credentials'});
        const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

        const response = await axios.post('https://accounts.spotify.com/api/token', data, {
            headers: { 
              'Authorization': `Basic ${auth_token}`,
              'Content-Type': 'application/x-www-form-urlencoded' 
            }
          })

          
          res.status(200).json( response.data );
    }
}