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
    name: "borç",
    aliases: ["owe"],
    description: "Ne kadar paraya sahip olduğunuzu gösterir.",
    execute(message, args) {}
};
