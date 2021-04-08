require("dotenv").config();

const commands = require("./commads")
const informations = require("./professores");
const Discord = require("discord.js");
const client = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"] //o bot terá acesso a coisas que aconteceram antes dele ser logado
});
const welcome = require("./welcome");

const PREFIX = "!";
const MOD_ME_COMMAND = "mod-me";

client.on('messageDelete', msg => {
    msg.channel.send("Pra que apagar quando Deus já viu?");
});

client.on('message', msg => {
    const index_hifen = msg.content.indexOf("-"); //retorna a posição do - na string
    const first_content = msg.content.slice(1, index_hifen)
    const second_content = msg.content.slice(index_hifen+1, (msg.content.legth))
    for (information of informations){
        if(first_content.toLowerCase() === information.nome){
            if(second_content === "contato"){
                msg.channel.send(`Contato do(a) professor(a): ${information.contato}`)
            }
            else if(second_content.toLowerCase() === "materias"){
                msg.channel.send(`Matéria do(a) professor(a): ${information.materia}`)
            }
        }
        const materia_especifica = information.materia.find(subject => {
            if (subject === first_content) return subject
        })
        if(first_content.toLowerCase() === materia_especifica){
            if(second_content === "hora"){
                msg.channel.send(`Hora da aula de ${first_content}: ${information.horario}`)
            }
            else if(second_content.toLowerCase() === "professor"){
                msg.channel.send(`Professor de ${first_content}: ${information.nome}`)
            }
        }
    }
    if(msg.content === `${PREFIX}${MOD_ME_COMMAND}`){
        modUser(msg.member)
    }
    else if(second_content === 'periodo'){
        msg.react(roleUser(msg.member, first_content));
        msg.reply(`você foi adicionado ao cargo do ${first_content} período`);
    }

});

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
            return '5️⃣'; //falta completar 
    }
}

function modUser(member){
    member.roles.add("820329139747422209");
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    welcome(client);
});

client.login(process.env.BOT_TOKEN);