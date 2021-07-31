module.exports = {
  name: "time",
  aliases: ["test", "pfp"],
  description: "Bugünün tarihini gösterir.",
  execute(message, args) {
    var today = new Date();
    var currentDate = today.toDateString();
    message.channel.send(currentDate);
  }
};
