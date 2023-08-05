import nodeHtmlToImage from 'node-html-to-image';
import * as dotenv from 'dotenv';

import { StorageHandler } from './storageHandler';

dotenv.config();

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
      align-items: center;
      justify-content: center;
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
        Берегись также, чтобы люди, заметив твое непочтение к родителям,
        не стали сообща презирать тебя, и чтобы тебе не остаться вовсе
        без друзей, потому что, как только они заметят твою неблагодарность
        к родителям, никто не может быть уверен, что, сделав тебе доброе дело,
        получит благодарность.“ —  Сократ
      </p>
    </div>
  </div>
</body>
</html>
`;

export const generateImage = async () => {
  try {
    const images = await storage.list();
    const imgUrl = `https://drive.google.com/uc?export=view&id=${images[4].id}`;
    await nodeHtmlToImage({
      output: `./${process.env.IMAGE_NAME}`,
      content: { imgUrl },
      html,
    });
  } catch (err) {
    throw new Error(err);
  }
};
