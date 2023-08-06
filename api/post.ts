import type { VercelRequest, VercelResponse } from '@vercel/node';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { TwitterApi } = require('twitter-api-v2');
import * as dotenv from 'dotenv';
import fs from 'fs';

import { generateImage } from './_imgGenerator';

dotenv.config();

/// TWITTER
const twitterClient = new TwitterApi({
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_KEY_SECRET,
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    await generateImage();
    const mediaId = await twitterClient.v1.uploadMedia(
      `/tmp/${process.env.IMAGE_NAME}`
    );
    await twitterClient.v2.tweet({
      media: { media_ids: [mediaId] },
    });
    return response.status(200).send('success');
  } catch (error) {
    console.log(error);
    return 'failed';
  } finally {
    fs.unlink(`/tmp/${process.env.IMAGE_NAME}`, () =>
      console.log('File deleted')
    );
  }
}
