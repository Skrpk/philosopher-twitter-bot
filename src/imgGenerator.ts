import nodeHtmlToImage from 'node-html-to-image';
import { promises } from 'fs';
import * as dotenv from 'dotenv';

import { StorageHandler } from './storageHandler';
import path from 'path';

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
      font-size: 3rem;
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

async function isFileExist(path: string) {
  try {
    return (await promises.stat(path)).isFile();
  } catch (e) {
    return false;
  }
}

const getStore = async () => {
  if (await isFileExist(path.join('/tmp/', 'store.json'))) {
    const data = await promises.readFile(
      path.join('/tmp/', 'store.json'),
      'utf8'
    );
    return JSON.parse(data) as StoreType;
  }

  await promises.writeFile(
    '/tmp/store.json',
    JSON.stringify({ imgIndex: 0, quotesIndex: 0 })
  );

  return { imgIndex: 0, quotesIndex: 0 };
};

const setStore = async (data: StoreType) => {
  await promises.writeFile(
    path.join('/tmp/', 'store.json'),
    JSON.stringify(data)
  );
};

const getQuoteAndLength = async (quotesIndex: number) => {
  const { quotes, quotesListLength } = await storage.getQuotes();
  return {
    quote: quotes[quotesIndex],
    quotesListLength,
  };
};

export const generateImage = async () => {
  try {
    const { imgIndex, quotesIndex } = await getStore();
    const images = await storage.list();
    const {
      quote: { text, author },
      quotesListLength,
    } = await getQuoteAndLength(quotesIndex);
    const imgUrl = `https://drive.google.com/uc?export=view&id=${images[imgIndex].id}`;

    await Promise.all([
      setStore({
        imgIndex: imgIndex !== images.length ? imgIndex + 1 : 0,
        quotesIndex: quotesIndex !== quotesListLength ? quotesIndex + 1 : 0,
      }),
      nodeHtmlToImage({
        output: `tmp/${process.env.IMAGE_NAME}`,
        content: { imgUrl, text, author },
        html,
      }),
    ]);
  } catch (err) {
    throw new Error(err);
  }
};
