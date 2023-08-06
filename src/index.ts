import fastify from 'fastify';
import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';
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

/// OPENAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
/// OPENAI-END

const port = Number(process.env.PORT) || 8080;
const server = fastify();

type BodyType = {
  message: string;
};

const CONTEXT =
  'Ответь на эту цитату от другого человека в стиле философа стоика, жившего в Риме во времена римской империи:';
const REPLY_SIZE = 'Максимальное количество символов в ответе: 160';
const NOTE = 'Примечание: не цитируй сообщение. Отвечай на русском языке';

server.post<{ Body: BodyType }>('/post', async (request, reply) => {
  try {
    await generateImage();
    const mediaId = await twitterClient.v1.uploadMedia(
      `/tmp/${process.env.IMAGE_NAME}`
    );
    await twitterClient.v2.tweet({
      media: { media_ids: [mediaId] },
    });
    return reply.status(200).send('success');
  } catch (error) {
    console.log(error);
    return 'failed';
  } finally {
    fs.unlink(`/tmp/${process.env.IMAGE_NAME}`, () =>
      console.log('File deleted')
    );
  }
});

server.post<{ Body: BodyType }>('/reply', async (request, reply) => {
  try {
    const { message } = request.body;
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `${CONTEXT} '${message}'. ${REPLY_SIZE}. ${NOTE}`,
        },
      ],
    });

    return reply.status(200).send({
      data: chatCompletion.data,
    });
  } catch (error) {
    console.log(error);
    return 'failed';
  }
});

server.get('/', async (request, reply) => {
  return reply.status(200).send('Hello world');
});

server.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

module.exports = server;
