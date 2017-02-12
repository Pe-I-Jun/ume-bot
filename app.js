var restify = require('restify');
var builder = require('botbuilder');

var bot = new builder.BotConnectorBot({ appId: process.env.MICROSOFT_APP_ID, appSecret: process.env.MICROSOFT_APP_PASSWORD});
var url = process.env.LUIS_MODEL_URL
var dialog = new builder.LuisDialog(url);

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

var server = restify.createServer();
server.post('/v1/messages', bot.listen());
server.listen(process.env.port || 8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});