module.exports = client => {
    const channelId = "820327108932141130";

    client.on("guildMemberAdd", member => {
        const message = "Bem-vindo ao servidor"

        const channel = member.guild.channels.cache.get(channelId)
        channel.send(message)
    })
}