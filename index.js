const express = require('express');
const cors = require('cors');
const nodemailer =require('nodemailer');
const multiparty = require('multiparty');
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));

//const path = require('path');

app.use(express.static('public'));



app.use("/public", express.static(process.cwd() + "/public"));

//app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user:process.env.EMAIL,
        pass:process.env.PASS
    },
});

transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("server will take message now");
    }
});

app.post("/send", (req, res) => {
    let form = new multiparty.Form();
    let data ={};
    form.parse(req, function(err, fields) {
        console.log(fields);
        Object.keys(fields).forEach(function(property) {
            data[property] = fields[property].toString();
        });
        console.log(data);
        const mail = {
            sender: `${data.name} <${data.email}>`,
            to: process.env.EMAIL,
            subject: data.project,
            text: `${data.name} <${data.email}> \n${data.message}`,
        };
        transporter.sendMail(mail, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send("Something went wrong.");
            } else {
                res.status(200).send("Email successfully sent");
            }
        });
    });
});

app.route("/").get(function (req, res) {
    res.sendFile(process.cwd() + "/public/index.html");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { 
    console.log(`Server is listening on port ${PORT}...`);
});
