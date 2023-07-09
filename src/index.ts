import fastify from 'fastify';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().then(() => console.log('Redis Client Connected'));

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const port = Number(process.env.PORT) || 8080;
const server = fastify();

type BodyType = {
  message: string;
};

const CONTEXT =
  'Ответь на эту цитату в стиле философа стоика, жившего в Риме во времена римской империи:';
const REPLY_SIZE = 'Максимальное количество символов в ответе: 280';
const NOTE = 'Примечание: не цитируй сообщение. Отвечай на русском языке';

server.post<{ Body: BodyType }>('/ping', async (request, reply) => {
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

    await client.set('resp', chatCompletion.data.choices[0].message.content);
    await client.disconnect();
    return chatCompletion.data.choices;
    return 'success';
  } catch (error) {
    console.log(error.message);
    return 'failed';
  }
});

server.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
