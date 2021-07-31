const db = require("quick.db");
const config = require("../config.json");
const Discord = require("discord.js");

const company = new db.table("company");
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
    name: "şirket",
    aliases: ["test", "pfp"],
    description: "Şirket",
    async execute(message, args) {
        var user = message.mentions.users.first()
            ? message.mentions.users.first()
            : message.author;

        //creating company
        if (args[0] === "kur") {
            if (user.id !== message.author.id) {
                message.channel.send(
                    embedMaker("Başkası adına şirket kuramazsın.", "red")
                );
                return;
            }

            if (company.has(`${user.id}.companyname`)) {
                message.channel.send(
                    embedMaker("Zaten bir şirketin var.", "red")
                );
                return;
            }

            let companyname = args.slice(1, args.length).join(" ");
            if (companyname === "" || companyname === null) {
                message.channel.send(embedMaker("Şirket adını giriniz", "red"));
                return;
            }
            if (companyname.length > 24) {
                message.channel.send(
                    embedMaker("Şirket adı 24 karakterden az olmalıdır.", "red")
                );
                return;
            } else {
                company.set(`${user.id}.companyname`, companyname);
                company.set(`${user.id}.property`, "Arsa");
                company.set(`${user.id}.gain`, 0);
                message.channel.send(embedMaker("Şirket başarıyla kuruldu."));
            }
        }

        //editing company name
        else if (args[0] === "değiştir") {
            if (user.id !== message.author.id) {
                message.channel.send(
                    embedMaker(
                        "Başkası adına şirket adını değiştiremezsin.",
                        "red"
                    )
                );
                return;
            }
            //checks user has company or not
            if (!company.has(`${user.id}.companyname`)) {
                message.channel.send(
                    embedMaker("Önce bir şirketin olmalı", "red")
                );
                return;
            }

            let companyname = args.slice(1, args.length).join(" ");

            if (companyname === "" || companyname === null) {
                message.channel.send(embedMaker("Şirket adını giriniz", "red"));
                return;
            }

            if (companyname.length > 24) {
                message.channel.send(
                    embedMaker("Şirket adı 24 karakterden az olmalıdır.", "red")
                );
                return;
            } else {
                company.set(`${user.id}.companyname`, companyname);
                message.channel.send(
                    embedMaker("Şirket adı başarıyla değiştirildi.")
                );
            }

            //deleting company
        } else if (args[0] === "kapat") {
            if (user.id !== message.author.id) {
                message.channel.send(
                    embedMaker("Başkasının şirketini kapatamazsın.", "red")
                );
                return;
            }

            if (!company.has(`${user.id}.companyname`)) {
                message.channel.send(
                    embedMaker("Önce bir şirketin olmalı.", "red")
                );
                return;
            }

            message.channel.send(
                embedMaker(
                    "Şirketiniz kapatılacaktır. Tüm varlıklarınız sıfırlanacaktır. Devam etmek istiyor musunuz?"
                )
            );

            const filter = (m) =>
                m.author.id === message.author.id &&
                (m.content.toLowerCase() === "evet" ||
                    m.content.toLowerCase() === "hayır");

            const collector = message.channel.createMessageCollector(filter, {
                time: 5000,
                max: 1
            });

            collector.on("collect", (message) => {
                if (message.content.toLowerCase() === "evet") {
                    company.delete(`${user.id}`);
                    message.channel.send(
                        embedMaker("Şirket başarıyla kapatıldı.")
                    );
                } else if (message.content.toLowerCase() === "hayır") {
                    message.channel.send(embedMaker("İşlem iptal edildi."));
                }
            });

            collector.on("end", (collected) => {
                if (!collected.size) {
                    message.channel.send(
                        embedMaker(
                            "Zamanında cevaplanmadığı için işlem iptal edildi.",
                            "red"
                        )
                    );
                }
            });
        } else if (args[0] === "geliştir") {
            function propertyUpgrader(required_money, next_property) {
                const filter = (m) =>
                    m.author.id === message.author.id &&
                    (m.content.toLowerCase() === "evet" ||
                        m.content.toLowerCase() === "hayır");

                const collector = message.channel.createMessageCollector(
                    filter,
                    {
                        time: 5000,
                        max: 1
                    }
                );

                collector.on("collect", (message) => {
                    if (message.content.toLowerCase() === "evet") {
                        if (money.get(`${user.id}.balance`) >= required_money) {
                            money.subtract(
                                `${user.id}.balance`,
                                required_money
                            );
                            company.set(`${user.id}.property`, next_property);
                            company.delete(`${user.id}.collectDate`);
                            message.channel.send(
                                embedMaker("Mülk başarıyla geliştirildi.")
                            );
                        } else {
                            message.channel.send(
                                embedMaker(
                                    "Geliştirmek için bakiye yetersiz.",
                                    "red"
                                )
                            );
                        }
                    } else if (message.content.toLowerCase() === "hayır") {
                        message.channel.send(embedMaker("İşlem iptal edildi."));
                    }
                });

                collector.on("end", (collected) => {
                    if (!collected.size) {
                        message.channel.send(
                            embedMaker(
                                "Zamanında cevaplanmadığı için işlem iptal edildi.",
                                "red"
                            )
                        );
                    }
                });
            }

            var required_money;
            var next_property;
            var gain;

            if (user.id !== message.author.id) {
                message.channel.send(
                    embedMaker("Başkasının şirketini geliştiremezsin.", "red")
                );
                return;
            }

            if (!company.has(`${user.id}`)) {
                message.channel.send(
                    embedMaker("Önce bir şirketin olmalı", "red")
                );
                return;
            }

            if (company.get(`${user.id}.property`) === "Arsa") {
                required_money = 1000;
                next_property = "Bakkal";
                gain = 250;
                message.channel.send(
                    embedMaker(
                        "Sonraki şirket mülkü: Bakkal\nŞirket yükseltme maliyeti: 1000₺\n\nDevam etmek istiyor musunuz?"
                    )
                );

                propertyUpgrader(required_money, next_property);
                company.set(`${user.id}.gain`, gain);
            } else if (company.get(`${user.id}.property`) === "Bakkal") {
                required_money = 2500;
                next_property = "Market";
                gain = 500;

                message.channel.send(
                    embedMaker(
                        "Sonraki şirket mülkü: Market\nŞirket yükseltme maliyeti: 2500₺\n\nDevam etmek istiyor musunuz?"
                    )
                );

                propertyUpgrader(required_money, next_property);
                company.set(`${user.id}.gain`, gain);
            } else if (company.get(`${user.id}.property`) === "Market") {
                required_money = 10000;
                next_property = "Fabrika";
                gain = 1500;

                message.channel.send(
                    embedMaker(
                        "Sonraki şirket mülkü: Fabrika\nŞirket yükseltme maliyeti: 10000₺\n\nDevam etmek istiyor musunuz?"
                    )
                );

                propertyUpgrader(required_money, next_property);
                company.set(`${user.id}.gain`, gain);
            } else if (company.get(`${user.id}.property`) === "Fabrika") {
                required_money = 50000;
                next_property = "Holding";
                gain = 3000;

                message.channel.send(
                    embedMaker(
                        "Sonraki şirket mülkü: Fabrika\nŞirket yükseltme maliyeti: 50000₺\n\nDevam etmek istiyor musunuz?"
                    )
                );

                propertyUpgrader(required_money, next_property);
                company.set(`${user.id}.gain`, gain);
            }
        }

        //company info
        else if (args[0] === "tipleri") {
            const embed = new Discord.MessageEmbed()
                .setAuthor("Şirket Tipleri")
                .setDescription(
                    "**Arsa**: Ücretsiz\n**Bakkal**:  1000₺\n**Market**: 2500₺\n**Fabrika**: 10000₺\n**Holding**:  50000₺"
                );

            message.channel.send(embed);
        } else {
            if (!company.has(`${user.id}.companyname`)) {
                message.channel.send(embedMaker("Kişinin şirketi yok.", "red"));
                return;
            }

            const CompanyEmbed = new Discord.MessageEmbed()
                .setColor("#00ffff")
                .setAuthor(`${user.username}`, `${user.avatarURL()}`)
                .addFields(
                    {
                        name: "Şirket adı",
                        value: company.get(`${user.id}.companyname`)
                    },
                    {
                        name: "Şirket Varlıkları",
                        value: company.get(`${user.id}.property`),
                        inline: true
                    }
                );
            message.channel.send(CompanyEmbed);
        }
    }
};
