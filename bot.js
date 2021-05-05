require("dotenv").config();

const informations = require("./professores");
const Discord = require("discord.js");
const client = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"] //o bot terá acesso a coisas que aconteceram antes dele ser logado
});
const mongoose = require('mongoose');
const channelId = "829026491550662687";

const PREFIX = "!";
/*
client.on('messageDelete', msg => {
    msg.channel.send("Pra que apagar quando Deus já viu?");
});
*/
mongoose.set("useCreateIndex", true)
mongoose.set("useUnifiedTopology", true)
mongoose.connect(process.env.BD_LINK, {useNewUrlParser: true, useFindAndModify: false})

const courseSchema = new mongoose.Schema({
    name: String,
    professor: String,
    time: String,
    contact: String,
    period: Number
})

const Course = new mongoose.model("Course", courseSchema)


client.on('message', msg => {
    const index_hifen = msg.content.indexOf("-"); //retorna a posição do - na string
    const first_content = msg.content.slice(1, index_hifen)
    const second_content = msg.content.slice(index_hifen+1, (msg.content.legth))
   
    if(second_content === "informação"){
        Course.findOne({name: first_content}, (err, found) =>{
            if(err){
                console.log(err)
            }else{
                msg.channel.send(`Professor: ${found.professor}\n Horário: ${found.time} \n Contato: ${found.contact} \n Período: ${found.period}`)
            }
        })
    }

    if(second_content === 'periodo'){
        msg.react(roleUser(msg.member, first_content));
        msg.reply(`você foi adicionado ao cargo do ${first_content} período`);
    }

});

/* ====== SET ROLES TO USERS ====== */
function roleUser(member, period){
    switch(period){
        case "primeiro":
            member.roles.add("829020097560576060");
            return '1️⃣';
        case "segundo":
            member.roles.add("829020103860551740");
            return '2️⃣';
        case "terceiro": 
            member.roles.add("829020110747861062"); 
            return '3️⃣';
        case "quarto": 
            member.roles.add("829020113466163220"); 
            return '4️⃣';
        case "quinto": 
            member.roles.add("829020115353468929"); 
            return '5️⃣';
        case "sexto":
            member.roles.add("829020118381232159");
            return '6️⃣';
        case "setimo":
            member.roles.add("829020121266782219");
            return '7️⃣';
        case "oitavo":
            member.roles.add("829020137189146684");
            return '8️⃣';
    }
}

client.on("guildMemberAdd", member => {
    const message = "Bem-vindo ao servidor"

    const channel = member.guild.channels.cache.get(channelId)
    channel.send(message)
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);