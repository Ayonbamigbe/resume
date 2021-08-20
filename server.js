// const express = require('express');
// const cors = require('cors');
// const nodemailer =require('nodemailer');
// const multiparty = require('multiparty');
// require("dotenv").config();

// const app = express();
// app.use(cors({ origin: "*" }));

// //const path = require('path');

// app.use(express.static('public'));



// app.use("/public", express.static(process.cwd() + "/public"));

// //app.use(express.static(path.join(__dirname, 'public')));

// const transporter = nodemailer.createTransport({
//     host:"smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//         user:process.env.EMAIL,
//         pass:process.env.PASS
//     },
// });

// transporter.verify(function(error, success) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("server will take message now");
//     }
// });

// app.post("/send", (req, res) => {
//     let form = new multiparty.Form();
//     let data ={};
//     form.parse(req, function(err, fields) {
//         console.log(fields);
//         Object.keys(fields).forEach(function(property) {
//             data[property] = fields[property].toString();
//         });
//         console.log(data);
//         const mail = {
//             sender: `${data.name} <${data.email}>`,
//             to: process.env.EMAIL,
//             subject: data.project,
//             text: `${data.name} <${data.email}> \n${data.message}`,
//         };
//         transporter.sendMail(mail, (err, data) => {
//             if (err) {
//                 console.log(err);
//                 res.status(500).send("Something went wrong.");
//             } else {
//                 res.status(200).send(`<script>alert("Hello")</script>`);
//             }
//         });
//     });
// });


// app.route("/").get(function (req, res) {
//     res.sendFile(process.cwd() + "/public/index.html");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => { 
//     console.log(`Server is listening on port ${PORT}...`);
// });











const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.engine('hbs', exphbs({ extname: '.hbs', defaultLayout: false, layoutsDir: "views/layout" }));
app.set('view engine', 'hbs');
app.set("views", "views");

app.use(express.static(path.join(__dirname, 'public')));
// app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('layout')
});

app.post('/send', (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</>
        <li>Email: ${req.body.email}</>
        <li>Subject: ${req.body.project}</>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user:process.env.EMAIL,
        pass:process.env.PASS
    }
  });

  // send mail with defined transport object
  let mailOptions = {
    from: ` ${req.body.name} <${req.body.email}>`, // sender address
    to: process.env.EMAIL, // list of receivers
    subject: `${req.body.project}`, // Subject line
    text:  `${req.body.name} <${req.body.email}> \n${req.body.message}`, // plain text body
    html: output // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  res.render('layout', {msg:'Mail has been sent'});
 
});
});


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`))