require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
var methodOverride = require('method-override')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('X-HTTP-Method-Override'))
app.use(express.static("public"))
app.set("view engine", "ejs")

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set("useCreateIndex", true)
mongoose.set("useUnifiedTopology", true)
mongoose.connect(process.env.BD_LINK, {useNewUrlParser: true, useFindAndModify: false});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

userSchema.plugin(passportLocalMongoose) 

const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


const courseSchema = new mongoose.Schema({
    name: String,
    professor: String,
    time: String,
    contact: String,
    period: String
})

const Course = new mongoose.model("Course", courseSchema)


app.route("/")
    .get((req, res) =>{
        res.render("login")
    })

    .post((req, res) =>{
        const user = new User({
            username: req.body.username,
            password: req.body.password
        })

        req.login(user, function(err){
            if(err){
                console.log(err);
            }else{
              User.authenticate("local")(req, res, function(){
                  res.redirect("/home");
              });  
            }
        })

    })


app.route("/home") 
   .get((req,res) =>{
        if(req.isAuthenticated()){
            res.render("home")
        }else{
            res.redirect("/")
        }
    })

   .post((req, res) =>{
        const course = req.body.courseName
        const professor = req.body.professorName
        const time = req.body.time
        const period = req.body.coursePeriod
        const contact = req.body.professorContact

        Course.findOne({name: course}, (err, found) =>{
            if(err){
                console.log(err)
            }else{
                Course.findOneAndUpdate(
                    {name: course}, 
                    {professor: professor || found.professor, 
                        time: time || found.time, 
                        contact: contact || found.contact, 
                        period: period || found.time
                    }, 

                    err =>{ 
                            if(err){
                                console.log(err)
                            }else{
                                console.log("Update")
                             }
                })
            }
        })

        res.render("home")
    })

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

app.listen(3000, () =>{
    console.log("Running on port 3000")
})