const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    },
    tls: {
      rejectUnauthorized: false
  }
  });



function sendMail(subject,list,url,emailid) {
	var mailOptions = {
        from: process.env.USER,
        to: emailid,
        subject: '',
        text:''
      };
mailOptions.subject = subject;
var i=0;
mailOptions.html="";
for(i=0;i<list.length; i++){
mailOptions.html = mailOptions.html+"<a href="+url+list[i].link+ ">" + list[i].title + "</a><br>";
}
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = sendMail;
