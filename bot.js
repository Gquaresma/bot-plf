require("dotenv").config();

const Discord = require("discord.js");
const welcome = require("./welcome");
const mongoose = require("mongoose")
const client = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"] //o bot terá acesso a coisas que aconteceram antes dele ser logado
});

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

const PREFIX = "!";
const MOD_ME_COMMAND = "mod-me";


client.on('message', msg => {
   
    const index_hifen = msg.content.indexOf("-"); //retorna a posição do - na string
    const first_content = (msg.content.slice(1, index_hifen)).toLocaleLowerCase()
    const second_content = msg.content.slice(index_hifen+1, (msg.content.legth))

    console.log(first_content, second_content)

    if(second_content === "informação"){
        Course.findOne({name: first_content}, (err, found) =>{
            console.log(found)
            if(err){
                console.log("euuu" + err)
            }else{
                msg.channel.send(`Professor: ${found.professor}\n Horário: ${found.time} \n Contato: ${found.contact} \n Período: ${found.period}`)
            }
        })   
    }


    


});

function roleUser(period){
    switch(period){
        case "primeiro":
            member.roles.add("829099566774222878");
           return '1️⃣';
        case "segundo":
            member.roles.add("820365418036068352");
            return '2️⃣';
        case "terceiro": 
            member.roles.add("829099586198700074"); 
            return '3️⃣';
        case "quarto": 
            member.roles.add("829099590145540160"); 
            msg.react("4️⃣")
            break
        case "quinto": 
            member.roles.add("829099593781870592"); 
            return '5️⃣';  
        case "sexto": 
            member.roles.add("829099596708970556"); 
            return ':six:'; 
        case "setimo": 
            member.roles.add("829099599854698536"); 
            return ':seven:';
        case "oitavo": 
            member.roles.add("829099602791366756"); 
            return ':eight:'; 
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