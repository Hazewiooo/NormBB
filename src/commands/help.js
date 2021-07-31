const config = require("../config.json");

module.exports = {
    name: "help",
    description: "Sahip oldugum tüm komutları gösterir.",
    aliases: ["commands"],
    usage: "[command name]",
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push("Sahip olduğum tüm komutlar:");
            data.push(commands.map((command) => command.name).join("\n⚪ "));
            data.push(
                `\n \`${config.prefix}help [komut ismi]\` yazarak komut hakkında yardım alabilirsin.`
            );

            return message.author
                .send(data, { split: true })
                .then(() => {
                    if (message.channel.type === "dm") return;
                    message.reply("Tüm komutlarımı özelden ilettim :)");
                })
                .catch((error) => {
                    console.error(
                        `Could not send help DM to ${message.author.tag}.\n`,
                        error
                    );
                    message.reply(
                        "Görünüşe göre sana DM gönderemiyorum üzgünüm."
                    );
                });
        }

        const name = args[0].toLowerCase();
        const command =
            commands.get(name) ||
            commands.find((c) => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply("Böyle bir komuta sahip değilim.");
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases)
            data.push(`**Eşkomutları:** ${command.aliases.join(", ")}`);
        if (command.description)
            data.push(`**Açıklama:** ${command.description}`);
        if (command.usage)
            data.push(
                `**Kullanım:** ${config.prefix}${command.name} ${command.usage}`
            );

        data.push(`**Cooldown:** ${command.cooldown || 3} saniye`);

        message.channel.send(data, { split: true });
    }
};
