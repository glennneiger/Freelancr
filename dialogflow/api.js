'use strict';
const {
    dialogflow,
    actionssdk,
    Image,
    Table,
    Carousel,
    SignIn
  } = require('actions-on-google');
  
const app = dialogflow({debug: true});

app.intent('testIntent', (conv) => {
    console.log("did something");
    conv.ask('646e');
});

app.intent('Default Welcome Intent', conv => {
    conv.ask(new SignIn('To get your account details'))
});
  
// Create a Dialogflow intent with the `actions_intent_SIGN_IN` event  
app.intent('Get Signin', (conv, params, signin) => {
    if (signin.status === 'OK') {
        const email = conv.user.email
        conv.ask(`I got your email as ${email}. What do you want to do next?`)
    } else {
        conv.ask(`I won't be able to save your data, but what do you want to next?`)
    }
 });

app.fallback((conv) => {
    conv.ask(`test`);
});

app.catch((conv, error) => {
    console.error(error);
    conv.ask('I encountered a glitch. Can you say that again?');
});

module.exports = app;