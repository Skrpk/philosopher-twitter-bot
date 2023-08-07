import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { TwitterApi } = require('twitter-api-v2');

import { generateImage } from './imgGenerator';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

/// TWITTER
const twitterClient = new TwitterApi({
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_KEY_SECRET,
});

/// TWITTER-END
(async () => {
  try {
    await generateImage();
    const mediaId = await twitterClient.v1.uploadMedia(
      `/tmp/${process.env.IMAGE_NAME}`
    );
    await twitterClient.v2.tweet({
      media: { media_ids: [mediaId] },
    });
    return 0;
  } catch (error) {
    console.log(error);
    return 1;
  } finally {
    // fs.unlink(`/tmp/${process.env.IMAGE_NAME}`, () =>
    //   console.log('File deleted')
    // );
  }
})();
