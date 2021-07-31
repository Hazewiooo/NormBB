/*const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("../config.json");
client.login(config.token);

module.exports = {
    name: "message",
    execute(message) {
        const coming = new Discord.MessageEmbed()
            .setColor("#37eb34")
            .setAuthor(`${message.author.username} mesaj gönderdi`)
            .setDescription(`Mesaj ${message.channel} adlı kanala geldi`)
            .setTimestamp()
            .setThumbnail(message.author.avatarURL())
            .addField("Mesajın İçeriği", ` ${message}`, true);

        if (message.author.bot || message.guild === null) return;

        let log_channel = null;
        log_channel = message.guild.channels.cache.find(
            (ch) => ch.name === "log"
        );

        if (log_channel == null) return;

        log_channel.send(coming);
    }
};*/
