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
var dialog = new builder.LuisDialog(url);


//=========================================================
// Bots Dialogs
//=========================================================


/*
bot .dialog('/', function (session) {
    session.send("Hello World from " + botenv );
});
*/

bot.add('/', dialog);

// Intent="what_day"の場合の処理
dialog.on('what_day', function(session, args) {
console.log('message:');
console.log(session.message);

var date = builder.EntityRecognizer.findEntity(args.entities, 'builtin.datetime.date');
console.log('date:');
console.log(date);

if (date != undefined && date.resolution != undefined) {
var d = new Date(date.resolution.date);
var day = '日月火水木金土'[d.getDay()];
session.send('その日は「' + day + '曜日」です。');
} else {
session.send('日付を取得できませんでした。');
}
});

// Intent="None"の場合の処理
dialog.onDefault(function(session, args) {
console.log('args:');
console.log(args);

console.log('message:');
console.log(session.message);

session.send("質問を理解できませんでした。もう一度、少し表現を変えて質問してみてください。")
});