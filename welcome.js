module.exports = client => {
    const channelId = "820327108932141130";
    const targetChannelId = "829105872831250484"

    client.on("guildMemberAdd", member => {
        const message = `<@${member.id}> BEM-VINDO(A)! Olhe o canal ${member.guild.channels.cache.get(targetChannelId).toString()}`

        const channel = member.guild.channels.cache.get(channelId)
        channel.send(message)
    })
}