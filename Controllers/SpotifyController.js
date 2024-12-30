import SpotifyWebApi from "spotify-web-api-node"
import qs from 'qs';
import axios from 'axios';

export default{
    route:'/spotify-get-access-token',
    handler:async (req, res) => {

        const client_id = process.env.SPOTIFY_CLIENT_ID;
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

        const data = qs.stringify({
            'grant_type':'client_credentials'
        });
        let scope = 'grant_type=client_credentials';
        const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

        const response = await axios({
            method:'POST',
            data:{
                grant_type: "client_credentials",
                scope: "user-read-private user-read-email",
                device_id:'bae918adcc819d48'
            },
            url:'https://accounts.spotify.com/api/token',
            headers: { 
                'Authorization': `Basic ${auth_token}`,
                'Content-Type': 'application/x-www-form-urlencoded' 
            }
        });

        const a = await fetch(`https://api.spotify.com/v1/me`, {
            headers: {
              'Authorization': `Bearer ${response.data.access_token}`
            }
          }).then(r=>r.json());
          console.log(a);
          return;


        const queryParams = qs.stringify({
            limit: 3,
            after: '1484811043508',
            scope:'app-remote-control,user-modify-playback-state,playlist-read-private'
          });

          const url = `https://api.spotify.com/v1/me/player/recently-played?${queryParams}`;
          const token = response.data.access_token;

        

            const resp = await axios.get(url,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    
                  }
            });
                console.log(resp)
                return resp.data
        

        
    }
}