const db = require("quick.db");

module.exports = {
    name: "message",
    execute(message) {
        var currentexp = db.get(`${message.author.id}.currentexp`);
        var currentlevel = db.get(`${message.author.id}.level`);
        var nextlevel = currentlevel + 1;
        var reqexp = db.get(`${message.author.id}.reqexp`);

        if (message.author.bot || currentexp == null) {
            return;
        }
        if (message.content.length > 5) {
            db.add(`${message.author.id}.currentexp`, 5);
            currentexp = db.get(`${message.author.id}.currentexp`);
        }

        if (currentexp >= reqexp) {
            message.reply("Tebrikler seviye atladın!");
            db.set(`${message.author.id}.level`, nextlevel);
            db.set(`${message.author.id}.currentexp`, currentexp - reqexp);
            db.set(`${message.author.id}.reqexp`, reqexp * 1.2);
        }
    }
};
