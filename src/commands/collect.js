const db = require("quick.db");
const config = require("../config.json");
const company = new db.table("company");
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
    name: "topla",
    aliases: ["collect"],
    description: "Ne kadar paraya sahip olduğunuzu gösterir.",
    execute(message, args) {
        var user = message.author;
        var today = new Date();
        var currentDate = today.toDateString();
        var gain = company.get(`${user.id}.gain`);

        if (!company.has(user.id))
            return message.channel.send(
                embedMaker("Önce şirketin olmalı", "red")
            );

        if (company.get(`${user.id}.collectDate`) === currentDate)
            return message.channel.send(
                embedMaker("Gün içinde para zaten toplanmış.", "red")
            );

        money.add(`${user.id}.balance`, gain);
        message.channel.send(
            embedMaker(
                `Geliriniz başarıyla toplandı.\nToplanan miktar **${gain}**`
            )
        );

        company.set(`${user.id}.collectDate`, currentDate);
    }
};
