const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();


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