const db = require("quick.db");
const config = require("../config.json");
const Discord = require("discord.js");
const money = new db.table("money");

function embedMaker(text, colorcode) {
    const embed = new Discord.MessageEmbed();
    if (colorcode === undefined) {
        colorcode = "#00FFFF";
    } else if (colorcode === "red") {
        colorcode = "#ff0000";
    }

    embed.setColor(colorcode).setDescription(text);
    return embed;
}

module.exports = {
    name: "para",
    aliases: ["test", "pfp"],
    description: "Ne kadar paraya sahip olduğunuzu gösterir.",
    execute(message, args) {
        var user = message.mentions.users.first()
            ? message.mentions.users.first()
            : message.author;

        var balance = money.get(`${user.id}.balance`);

        if (balance === null) {
            money.set(`${user.id}.balance`, 0);
            balance = money.get(`${user.id}.balance`);
        }

        if (
            !args[0] ||
            args[0] === `<@!${message.mentions.users.first().id}>`
        ) {
            message.channel.send(embedMaker(`Kullanıcının parası: ${balance}`));
        } else if (args[0] === "gönder") {
            user = message.author.id;
            let target_user = message.mentions.users.first().id;
            let amount = Number(args[2]);

            if (!Number.isInteger(amount) || amount < 0) {
                message.channel.send(
                    embedMaker(
                        "Lütfen değeri pozitif tam sayı olarak giriniz.",
                        "red"
                    )
                );
                return;
            }

            if (money.get(`${user}.balance`) < amount) {
                message.channel.send(embedMaker("Paran yetersiz.", "red"));
            } else {
                money.add(`${target_user}.balance`, amount);
                money.subtract(`${user}.balance`, amount);
                message.channel.send(embedMaker("Para başarıyla gönderildi."));
            }
        } else if (args[0] === "set" && message.author.id === config.owner_id) {
            let target_user = message.mentions.users.first();
            money.set(`${target_user.id}.balance`, Number(args[2]));
            message.delete();
        }
    }
};
