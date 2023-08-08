import nodeHtmlToImage from 'node-html-to-image';
import * as dotenv from 'dotenv';

import { StorageHandler } from './storageHandler';

dotenv.config();

export type StoreType = {
  imgIndex: number;
  quotesIndex: number;
};

const storage = new StorageHandler();

const html = `<html>
<head>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Inter"
  />
  <style>
    body {
      min-width: 2000px;
    }
    .container {
      background-color: #000;
      display: flex;
    }
    .img-wrapper {
      position: relative;
    }
    .img-wrapper:after {
      position: absolute;
      width: 10%;
      right: 0;
      top: 0;
      content: '';
      display: block;
      height: 100%;
      background-image: linear-gradient(to right, transparent, #000);
    }
    .text-wrapper {
      padding: 80px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 40px;
    }
    .text {
      font-family: 'Inter', sans-serif;
      font-size: 4rem;
      color: #fff;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="img-wrapper">
      <img src="{{ imgUrl }}" />
    </div>
    <div class="text-wrapper">
      <p class="text">
        {{ text }}
      </p>
      <p class="text">
        {{ author }}
      </p>
    </div>
  </div>
</body>
</html>
`;

const getQuoteAndLength = async (quotesIndex: number) => {
  const { quotes, quotesListLength } = await storage.getQuotes();
  console.log('>>>>>', 'getQuoteAndLength', quotesIndex, quotes[0]);
  return {
    quote: quotes[quotesIndex],
    quotesListLength,
  };
};

export const generateImage = async () => {
  try {
    const [{ imgIndex, quotesIndex }, images] = await Promise.all([
      storage.getStore(),
      storage.list(),
    ]);
    const {
      quote: { text, author },
      quotesListLength,
    } = await getQuoteAndLength(quotesIndex);
    const imgUrl = `https://drive.google.com/uc?export=view&id=${images[imgIndex].id}`;

    await Promise.all([
      storage.setStore({
        imgIndex: imgIndex !== images.length ? imgIndex + 1 : 0,
        quotesIndex: quotesIndex !== quotesListLength ? quotesIndex + 1 : 0,
      }),
      nodeHtmlToImage({
        puppeteerArgs: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
        output: `/tmp/${process.env.IMAGE_NAME || 'image.png'}`,
        content: { imgUrl, text, author },
        html,
      }),
    ]);
    console.log('Image generated');
  } catch (err) {
    throw new Error(err);
  }
};
