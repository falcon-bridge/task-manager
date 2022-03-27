const sgMail = require("@sendgrid/mail");

const sendgridAPIKey =
  "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";

sgMail.setApiKey(sendgridAPIKey);

// sgMail
//   .send({
//     to: "falcon.bridge2000@gmail.com",
//     from: "kumar.rkt2020@gmail.com",
//     subject: "Hello, I am using sendgrid !",
//     text: "I am testing the sendgrid service.",
//   })
//   .then(() => {
//     console.log("Email sent");
//   })
//   .catch((err) => {
//     console.log("an error occured");
//     console.log(err);
//   });

const sendWelcomeEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: "kumar.rkt2020@gmail.com",
      subject: "Thanks for joining the Task App",
      text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
    })
    .then(() => {
      console.log("Email sent");
    })
    .catch((err) => {
      console.log("An error occured");
      console.log(err);
    });
};

const sendCancelationEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: "kumar.rkt2020@gmail.com",
      subject: "Sorry to see you go !",
      text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
    })
    .then(() => {
      console.log("Email sent");
    })
    .catch((err) => {
      console.log("An error occured");
      console.log(err);
    });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
