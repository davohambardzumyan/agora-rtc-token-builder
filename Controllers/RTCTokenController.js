import ChatTokenBuilder from "agora-token";

export default {
    route:'/rtcToken',
    handler:(req, res) => {

        const { channelName,isPublisher } = req.body;

        if (!channelName  || isPublisher === undefined) {

            return res.status(400).json({
                'error':"Channel Name,uid and isPublisher are required."
            });
        }

        if (typeof channelName !== "string"){

            return res.status(400).json({
                'error':"Channel Name must be string."
            });

        }

        const expireTimeInSeconds = 3600;
        const currentTimestamp = Math.floor(Date.now() / 1000); // Get the current timestamp in seconds
        const privilegeExpiredTs = currentTimestamp + expireTimeInSeconds;

        const AGORA_APP_ID='b5c8c3df2621406a80e2f2d616971085';
        const AGORA_APP_CERTIFICATE='3828f58f3073421a8f5bff62f8420477';

        const token = ChatTokenBuilder.RtcTokenBuilder.buildTokenWithUid(
            AGORA_APP_ID,
        AGORA_APP_CERTIFICATE,
            channelName,
            0,
            (isPublisher ? ChatTokenBuilder.RtcRole.PUBLISHER  : ChatTokenBuilder.RtcRole.SUBSCRIBER),// 0 is attendee
            expireTimeInSeconds,
            privilegeExpiredTs

        )

        res.status(200).json({ token,channel:channelName,uid:0,app_id:AGORA_APP_ID });
    }
}