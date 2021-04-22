require("dotenv").config();

const commands = require("./commads")
const informations = require("./professores");
const Discord = require("discord.js");
const welcome = require("./welcome");
const client = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"] //o bot terá acesso a coisas que aconteceram antes dele ser logado
});

const reactionRole = require("./reactionRole");

const PREFIX = "!";
const MOD_ME_COMMAND = "mod-me";

client.on('message', msg => {
   
    const index_hifen = msg.content.indexOf("-"); //retorna a posição do - na string
    const first_content = (msg.content.slice(1, index_hifen)).toLocaleLowerCase()
    const second_content = msg.content.slice(index_hifen+1, (msg.content.legth))

    for (information of informations){
        if(first_content === information.nome){
            if(second_content === "contato"){
                msg.channel.send(`Contato do(a) professor(a): ${information.contato}`)
            }
            else if(second_content.toLowerCase() === "materias"){
                msg.channel.send(`Matéria do(a) professor(a): ${information.materia}`)
            }
        }
        //alterar essa parte (criar array de materias por fora)
        const materia_especifica = information.materia.find(subject => {
            if (subject === first_content) return subject
        })
        if(first_content === materia_especifica){
            if(second_content === "hora"){
                msg.channel.send(`Hora da aula de ${first_content}: ${information.horario}`)
            }
            else if(second_content.toLowerCase() === "professor"){
                msg.channel.send(`Professor de ${first_content}: ${information.nome}`)
            }
        }
    }


    if(msg.content === `${PREFIX}role`){

        reactionRole(client)
    }
    
    if(msg.content === `${PREFIX}${MOD_ME_COMMAND}`){
        modUser(msg.member)   
    }
});

function modUser(member){
    member.roles.add("820329139747422209");
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    welcome(client);
});

client.login(process.env.BOT_TOKEN);