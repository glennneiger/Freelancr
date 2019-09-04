'use strict';
const {
    dialogflow,
    actionssdk,
    Image,
    Table,
    Carousel,
  } = require('actions-on-google');
  
const app = dialogflow({debug: true});

app.intent('testIntent', (conv) => {
    console.log("did something");
    conv.ask('646e');
});

app.intent('Default Welcome Intent', (conv) => {
    conv.ask('How are you?');
});

app.fallback((conv) => {
    conv.ask(`test`);
});

app.catch((conv, error) => {
    console.error(error);
    conv.ask('I encountered a glitch. Can you say that again?');
});

module.exports = app;