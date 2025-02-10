import SpotifyWebApi from "spotify-web-api-node"
import qs from 'qs';
import axios from 'axios';

export default {
    route: '/spotify-login',
    handler: async (req, res) => {

        const redirect_uri = process.env.SPOTIFY_REDIRECT_URL;
        const scopes = ['user-read-recently-played user-read-playback-state user-modify-playback-state streaming'];

        const client_id = process.env.SPOTIFY_CLIENT_ID;
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

        const generateRandomString = (length) => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            return Array.from({ length }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join('');
        };

        const state = generateRandomString(16);

        const authQueryParameters = new URLSearchParams({
            response_type: 'code',
            client_id: client_id,
            scope: scopes.join(' '),
            redirect_uri: redirect_uri,
            state: state
        });
    
        return res.json( `https://accounts.spotify.com/authorize?${authQueryParameters.toString()}`);
    }
}