const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const http = require('http');
// const server = http.createServer(app); // WebSocket
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const { Server } = require("socket.io");  // WebSocket
// const { io: ClientIO } = require('socket.io-client');  // WebSocket
// const multer = require("multer");

const chatRouter = require("./routes/chat.js");
const profileRouter = require("./routes/profile.js");
const appointmentRouter = require("./routes/appointment.js");
const newsRouter = require("./routes/news.js");
const authRouter = require("./routes/authentication.js");

main().then(() => { console.log("connected to database") }).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/medimate');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

    
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}


app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currUser = req.user;
    next();
})

app.get("/", (req, res) => {
    return res.redirect("/chat");
})

app.use("/authentication", authRouter);
app.use("/chat", chatRouter);
app.use("/profile", profileRouter);
app.use("/appointment", appointmentRouter);
app.use("/news", newsRouter);

app.get('/favicon.ico', (req, res) => res.status(204).end());  // remove this if using a favicon.ico in html

app.all("*", (req, res, next) => {
    console.log("Original url 1: " + req.originalUrl);
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    console.log("Original url 2: " + req.originalUrl);
    console.log(err);
    let { statusCode = 500, message = "Internal Server Error" } = err;
    res.status(statusCode).render("error.ejs", { err, statusCode });
})

// io.on('connection', (socket) => {
//     console.log('a user connected ', socket.id);
// });

// server.listen(3000, () => {
//     console.log("listening at port 3000");
// });

app.listen(3000, () => {
    console.log("listening at port 3000");
});