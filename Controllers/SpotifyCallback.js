import SpotifyWebApi from "spotify-web-api-node"
import qs from 'qs';
import axios from 'axios';



        
export default{
    route:'/spotify-callback',
    handler:async (req, res) => {
        const code = req.query.code || null;
        const client_id = process.env.SPOTIFY_CLIENT_ID;
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
        const redirect_uri =  process.env.SPOTIFY_REDIRECT_URL;
        const scopes = ['user-read-recently-played'];
    if (!code) {
        console.error('No authorization code received from Spotify');
        return res.status(400).send('No authorization code received');
    }

    // Log the parameters we're sending
    console.log('Sending token request with parameters:', {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    });

    try {
        // Convert parameters to x-www-form-urlencoded format
        const params = new URLSearchParams({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        });

        // Create authorization header
        const auth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
        
        console.log('Making request to Spotify token endpoint...');
        
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: params,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Token request successful');
        const accessToken = response.data.access_token;
        
        // Try to get recently played tracks
        const recentTracks = await getRecentlyPlayed(accessToken);
        res.json(recentTracks);

    } catch (error) {
        console.error('Detailed error information:');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Error Data:', error.response?.data);
        
        // Check for common issues
        if (!client_id || !client_secret) {
            return res.status(500).send('Missing Spotify credentials. Check your .env file.');
        }
        
        if (error.response?.status === 400) {
            return res.status(400).send(`
                Bad Request. Common causes:
                1. Invalid redirect URI (current: ${redirect_uri})
                2. Invalid authorization code
                3. Authorization code already used
                4. Client ID/Secret mismatch
                
                Check your Spotify Developer Dashboard settings and ensure:
                - Redirect URI matches exactly
                - Client ID and Secret are correct
                - You're not reusing an old authorization code
            `);
        }
        
        res.status(500).send(`Authentication failed: ${error.message}`);
    }

        async function getRecentlyPlayed(accessToken, limit = 3) {
            console.log(444)
            try {
                const response = await axios({
                    method: 'get',
                    url: 'https://api.spotify.com/v1/me/player/recently-played',
                    params: {
                        limit: limit
                    },
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
               return response.data;
        
                // Transform the response to include images
                const tracks = response.data.items.map(async item => ({
                    trackName: item.track.name,
                    artist: item.track.artists.map(artist => artist.name).join(', '),
                    album: item.track.album.name,
                    playedAt: new Date(item.played_at).toLocaleString(),
                    duration: Math.floor(item.track.duration_ms / 1000),
                    spotifyUrl: item.track.external_urls.spotify,
                    images: {
                        album: item.track.album.images.reduce((acc, image) => {
                            // Categorize images by size
                            switch(image.height) {
                                case 640:
                                    acc.large = image.url;
                                    break;
                                case 300:
                                    acc.medium = image.url;
                                    break;
                                case 64:
                                    acc.small = image.url;
                                    break;
                            }
                            return acc;
                        }, {})
                    },
                    // Include artist images if available
                    artistImages: await Promise.all(item.track.artists.map(async (artist) => {
                        try {
                            const artistResponse = await axios({
                                method: 'get',
                                url: `https://api.spotify.com/v1/artists/${artist.id}`,
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`
                                }
                            });
                            return {
                                name: artist.name,
                                images: artistResponse.data.images
                            };
                        } catch (error) {
                            console.warn(`Couldn't fetch images for artist ${artist.name}`);
                            return {
                                name: artist.name,
                                images: []
                            };
                        }
                    }))
                }));
        
                return tracks;
            } catch (error) {
                console.error('Error fetching recently played tracks:', error.message);
                throw error;
            }
        }
    }
}