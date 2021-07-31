const db = require("quick.db");
const config = require("../config.json");
const Canvas = require("canvas");
const Discord = require("discord.js");

function createProfile(user) {
    db.set(`${user.id}.currentexp`, 0);
    db.set(`${user.id}.level`, 1);
    db.set(`${user.id}.reqexp`, 250);
    db.set(`${user.id}.colorcode`, "#ffffff");
    db.set(
        `${user.id}.bgurl`,
        "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569__480.jpg"
    );
}

module.exports = {
    name: "profil",
    aliases: ["test", "pfp"],
    description: "Ne kadar paraya sahip olduğunuzu gösterir.",
    async execute(message, args) {
        var user = message.mentions.users.first()
            ? message.mentions.users.first()
            : message.author;
        if (args[0] === "renk") {
            if (args[1].startsWith("#") && args[1].length === 7) {
                db.set(`${user.id}.colorcode`, args[1]);
                const succes = new Discord.MessageEmbed()
                    .setColor(args[1])
                    .setAuthor(`Profil Sistemi`)
                    .setDescription(
                        `Renk başarıyla değiştirildi.\nYeni renginiz solda göründüğü gibidir.`
                    );
                message.delete();
                user.send(succes);
            } else {
                user.send("Lütfen renk kodunu başında # ile beraber giriniz");
            }
        } else if (args[0] === "arkaplan") {
            if (args[1].endsWith(".jpg") || args[1].endsWith(".png")) {
                db.set(`${user.id}.bgurl`, args[1]);
                const succes = new Discord.MessageEmbed()
                    .setColor("#ffffff")
                    .setAuthor(`Profil Sistemi`)
                    .setImage(args[1])
                    .setDescription(
                        `Arkaplanınız başarıyla değiştirildi.\nYeni arkaplanınız göründüğü gibidir.`
                    );
                message.delete();
                user.send(succes);
            } else {
                user.send(
                    "Lütfen fotoğrafın linkinin .png ya da .jpg ile bittiğine emin olun."
                );
            }
        } else if (args[0] === "düzenle") {
            const commands = new Discord.MessageEmbed()
                .setColor("#37eb34")
                .setAuthor(`Profil Sistemi`)
                .setDescription(
                    `Profilinizi düzenlemek için kullanacağınız komutlar aşağıdaki gibidir.`
                )
                .setThumbnail(
                    "https://i.pinimg.com/736x/5f/40/6a/5f406ab25e8942cbe0da6485afd26b71.jpg"
                )
                .addField(
                    "Profil arkaplanını düzenle",
                    `!profil arkaplan resim-linki`,
                    true
                )
                .addField(
                    "Profil arkaplanını düzenle",
                    `!profil renk renk-hex-kodu`,
                    true
                );
            message.delete();
            user.send(commands);
        } else if (
            args[0] === "sıfırla" &&
            message.author.id === config.owner_id
        ) {
            createProfile(user);
            message.author.send("Profil sıfırlama başarılı");
        } else {
            var currentexp = db.get(`${user.id}.currentexp`);
            var currentlevel = db.get(`${user.id}.level`);
            var nextlevel = currentlevel + 1;
            var reqexp = db.get(`${user.id}.reqexp`);
            let bgurl = db.get(`${user.id}.bgurl`);
            var colorcode = db.get(`${user.id}.colorcode`);

            if (currentlevel == null) {
                createProfile(user);
                currentexp = db.get(`${user.id}.currentexp`);
                currentlevel = db.get(`${user.id}.level`);
                nextlevel = currentlevel + 1;
                reqexp = db.get(`${user.id}.reqexp`);
                bgurl = db.get(`${user.id}.bgurl`);
                colorcode = db.get(`${user.id}.colorcode`);
            }
            const canvas = Canvas.createCanvas(700, 250);
            const context = canvas.getContext("2d");
            var bg = await Canvas.loadImage(bgurl);
            context.drawImage(bg, 0, 0, canvas.width, canvas.height);
            const avatar = await Canvas.loadImage(
                user.displayAvatarURL({ format: "jpg" })
            );

            // username
            context.font = "55px sans-serif";
            context.fillStyle = colorcode;
            context.fillText(user.username, 250, 100);
            //

            // level and level numbers
            context.font = "30px sans-serif";
            context.fillStyle = colorcode;
            context.fillText(`${currentlevel} Seviye`, 550, 100);
            context.fillText(`${currentlevel}`, 250, 168); // current level
            context.fillText(`${nextlevel}`, 650, 168); // next level
            //

            var pixelperexp = 370 / reqexp;
            var pixel = pixelperexp * currentexp;

            // progressbar
            context.fillStyle = "#ffffff";
            context.fillRect(275, 140, 370, 30);
            //

            //progressbar inner
            context.fillStyle = "#00cc00";
            context.fillRect(275, 140, pixel, 30);
            //

            // current exp and required exp
            context.fillStyle = colorcode;
            context.fillText(`(${currentexp} / ${reqexp})`, 390, 210);

            // Beyaz border
            context.beginPath();
            context.arc(125, 115, 105, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.fillStyle = colorcode;
            context.fillRect(20, 10, 210, 210);
            //

            // Profil Image
            context.beginPath();
            context.arc(125, 115, 100, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(avatar, 25, 15, 200, 200);
            //

            const attachment = new Discord.MessageAttachment(
                canvas.toBuffer(),
                "rank-card.png"
            );

            message.channel.send(
                `Profilin üzerinde değişiklik yapman için !profil düzenle yazabilirsin.`,
                attachment
            );
        }
    }
};
