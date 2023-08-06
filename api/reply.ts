import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Configuration, OpenAIApi } from 'openai';

const CONTEXT =
  'Ответь на эту цитату от другого человека в стиле философа стоика, жившего в Риме во времена римской империи:';
const REPLY_SIZE = 'Максимальное количество символов в ответе: 160';
const NOTE = 'Примечание: не цитируй сообщение. Отвечай на русском языке';

/// OPENAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
/// OPENAI-END

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
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

    return response.status(200).send({ data: chatCompletion.data });
  } catch (error) {
    console.log(error);
    return 'failed';
  }
}
