const db = require("quick.db");
const config = require("../config.json");
const company = new db.table("company");
const Discord = require("discord.js");
const { UserFlags } = require("discord.js");
const money = new db.table("money");
const { MessageButton, MessageActionRow } = require("discord-buttons");

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
    name: "iddia",
    aliases: ["bet"],
    description: "Ne kadar paraya sahip olduğunuzu gösterir.",
    async execute(message, args) {
        var amount = Number(args[1]);
        var user = message.author;
        var target = message.mentions.users.first();
        var msgid = message.id;

        if (!target)
            return message.channel.send(
                embedMaker("Bir rakibiniz olmalı", "red")
            );
        if (!args[1])
            return message.channel.send(embedMaker("Miktarı giriniz.", "red"));
        if (!Number.isInteger(amount) || amount <= 0)
            return message.channel.send(
                embedMaker("Miktar pozitif tam sayı olmalı", "red")
            );
        if (money.get(`${user.id}.balance`) < amount)
            return message.channel.send(
                embedMaker("Yeterli paranız yok.", "red")
            );
        if (money.get(`${target.id}.balance`) < amount)
            return message.channel.send(
                embedMaker("Rakibin yeterli parası yok.", "red")
            );

        let bet_yes_button = new MessageButton()
            .setStyle("green")
            .setLabel("Evet")
            .setID("bet_offer_yes");

        let bet_no_button = new MessageButton()
            .setStyle("red")
            .setLabel("Hayır")
            .setID("bet_offer_no");

        let row = new MessageActionRow().addComponents(
            bet_yes_button,
            bet_no_button
        );

        var bet_offer = message.channel
            .send(
                embedMaker(
                    `${target},\n${user} adlı kullanıcı size ${amount}₺'lik iddia teklifi yolladı.\n\nKabul ediyor musunuz? `
                ),
                row
            )
            .then((message) => {
                const filter = (button) => button.clicker.user.id === target.id;
                const collector = message.createButtonCollector(filter, {
                    time: 7000,
                    max: 1
                });
                collector.on("collect", async (button) => {
                    if (button.id === "bet_offer_yes") {
                        button.message.edit(
                            embedMaker(
                                `${target},\n${user} adlı kullanıcının ${amount}₺'lik iddia teklifini kabul etti.`
                            )
                        );

                        await button.reply.think();
                        var bet_random_number = Math.floor(Math.random() * 100);
                        var winner, loser;

                        if (bet_random_number < 50) {
                            winner = user;
                            loser = target;
                        } else {
                            winner = target;
                            loser = user;
                        }

                        money.add(`${winner.id}.balance`, amount);
                        money.subtract(`${loser.id}.balance`, amount);

                        setTimeout(() => {
                            button.reply.edit(
                                embedMaker(`Kazanan: **${winner}**`)
                            );
                        }, 3000);
                    } else {
                        message.delete();
                        message.channel.messages
                            .fetch(msgid)
                            .then((msg) => msg.delete());
                        message.channel.send(
                            embedMaker(
                                `${target} tarafından ${user}'a gönderilen iddia reddedildi.`,
                                "red"
                            )
                        );
                    }
                });
            });

        console.log(amount, user.username, target.username);
    }
};
