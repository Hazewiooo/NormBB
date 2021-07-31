const db = require("quick.db");
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
    name: "dilen",
    cooldown: 60,
    aliases: ["dilenci"],
    description: "İlk şirketinizi kurana kadar dilenebilirsiniz.",
    execute(message, args) {
        var user = message.author;
        var today = new Date();
        var gain = Math.floor(Math.random() * 200);

        if (company.has(user.id))
            return message.channel.send(
                embedMaker("Eğer şirketin var ise dilenemezsin.", "red")
            );

        money.add(`${user.id}.balance`, gain);
        message.channel.send(
            embedMaker(
                `Sokakta başarıyla dilendin.\nToplanan miktar **${gain}**`
            )
        );
    }
};
