const nodemailer = require('nodemailer');

const sendMail = async (category, content, nickname) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: `[FILL-IN Noti] ${category} 제보`,
    html: `
            <h3>FILL-IN에서 새로운 건의/제보가 들어왔어요.</h3> 
            <hr>

            <h4>${nickname} 님의 제보입니다.</h4>
            <p>${content} </p>
    
            <p>본 메일은 발신 전용 메일로서 회신 되지 않습니다.</p>
            `,
  });
};

module.exports = { sendMail };
