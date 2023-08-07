import nodeHtmlToImage from 'node-html-to-image';

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

(async () => {
  nodeHtmlToImage({
    puppeteerArgs: {
      // executablePath: '/app/.chromedriver/bin/chromedriver',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    output: `/tmp/${process.env.IMAGE_NAME}`,
    content: {
      imgUrl:
        'https://opengraph.githubassets.com/fabc49973118bdb6678f5d444914bad7df46c1472aa863884a0e4e0a830f1588/puppeteer/puppeteer/issues/4796',
      text: 'text1',
      author: 'author',
    },
    html,
  });
})();
