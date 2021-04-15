const checkInternetConnected = require('check-internet-connected');
const Twitter = require('twitter');
require('dotenv').config();

// Twitter bot

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const twitterPost = (newStatus) => {
  client.post('statuses/update', { status: newStatus }, function (error, tweet, response) {
    if (!error) {
      console.log(`Tweet successful: ${tweet.text}`);
    } else {
      console.log(error);
    }
  });
};

// Internet checking logic

const config = {
  timeout: 5000,
  retries: 0,
  domain: 'google.com',
};

let isInternet = true;
let timesDown = 0;

const checkInternet = () => {
  checkInternetConnected(config)
    .then(() => {
      console.log('Connection available');
      if (!isInternet) {
        // this block will run when the internet has come back online after being down
        const twitterStatus = `Hey @SparkNZ, my internet has just cut out AGAIN. It has dropped ${timesDown} ${
          timesDown === 1 ? 'time' : 'times'
        } today so far. Am I a bot? Maybe I am. \nhttps://github.com/bscottnz/internet-test-twitter-bot/blob/main/internetTest.js`;

        twitterPost(twitterStatus);

        isInternet = true;
      }
    })
    .catch((err) => {
      if (isInternet) {
        // only increment timesDown if there was previously a connection
        timesDown++;
      }
      isInternet = false;
      console.log('Internet down.');
    });
};

setInterval(checkInternet, 10000);
