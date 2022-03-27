const sgMail = require("@sendgrid/mail");

const sendgridAPIKey =
  "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";

sgMail.setApiKey(sendgridAPIKey);

sgMail
  .send({
    to: "falcon.bridge2000@gmail.com",
    from: "kumar.rkt2020@gmail.com",
    subject: "Hello, I am using sendgrid !",
    text: "I am testing the sendgrid service.",
  })
  .then(() => {
    console.log("Email sent");
  })
  .catch((err) => {
    console.log("an error occured");
    console.log(err);
  });
