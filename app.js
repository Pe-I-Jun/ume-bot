var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
var botenv = process.env.BOT_ENV;
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s (%s)', server.name, server.url, botenv);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());



//=========================================================
//LUIS Setup
//=========================================================
var url = process.env.LUIS_MODEL_URL;
// 認識に指定するLUIS APIのURLを指定
var recognizer = new builder.LuisRecognizer(url);


//=========================================================
// Bots Dialogs
//=========================================================


/*
bot .dialog('/', function (session) {
    session.send("Hello World from " + botenv );
});
*/

//=========================================================
// IntentDialogオブジェクトの用意
//=========================================================



// IntentDialogオブジェクトを作成
var intents = new builder.IntentDialog({
  recognizers: [recognizer]
});


//=========================================================
// 会話の処理
//=========================================================

// 初期ダイアログを、intentDialogとして使用する
bot.dialog('/', intents);

// インテントと処理の結びつけ
intents
    .matches('コーヒー全般', function (session, args) {

       session.send("コーヒー？" + botenv );
    })
    .matches('None', function (session, args) {

       session.send("よくわからん" );

    })
