const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.set("view engine", "ejs")

app.use(session({
    secret: "BOT UPE PLF.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set("useCreateIndex", true)
mongoose.set("useUnifiedTopology", true)

mongoose.connect("mongodb+srv://gabriel:06050200@upebot.lmehj.mongodb.net/botdb?retryWrites=true&w=majority", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

userSchema.plugin(passportLocalMongoose) 

const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

const courseSchema = new mongoose.Schema({
    name: String,
    professor: String,
    time: String,
    contact: String,
    period: Number
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


app.get("/home", (req,res) =>{
    if(req.isAuthenticated()){
        res.render("home")
    }else{
        res.redirect("/")
    }
})

app.post("/home", (req, res) =>{
    const course = req.body.courseName
    const professor = req.body.professorName
    const time = req.body.time
    const period = req.body.coursePeriod
    const contact = req.body.professorContact

    const subject = new Course({
        name: course,
        professor: professor,
        time: time,
        contact: contact,
        period: period
    })

    subject.save()
    res.render("home")

})

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

app.listen(3000, () =>{
    console.log("Running on port 3000")
})