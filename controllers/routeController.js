const nodemailer = require('nodemailer');
require('dotenv').config()

let email;
let name;
let amount;


module.exports.homeGET = (req, res) => {
    res.render('index.ejs', { title: process.env.TITLE })
}


module.exports.donate = (req, res) => {
    email = req.body.email
    name = req.body.name
    amount = req.body.amount
    console.log(name, email, amount)
    res.render('donate.ejs', { amount: amount, title: process.env.TITLE })
}

module.exports.success = (req, res) => {


    // Generate SMTP service account from ethereal.email
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }

        console.log('Credentials obtained, sending message...');

        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }
        });

        // Message object
        let message = {
            from: 'Paypal',
            to: email,
            subject: 'Payment Receipt',
            text: 'Hello to myself!',
            html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>success</title>
        
        <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
        <style>
   body{
      text-align: center;
   }
   img{
      width: 200px;
   }
</style>
</head>
        <body>
        <img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcraftizen.org%2Fwp-content%2Fuploads%2F2019%2F02%2Fsuccessful_payment_388054.png&f=1&nofb=1" alt="">
            <div class="container">
                <div class="row">
                   <div class="col-md-6 mx-auto mt-5">
                      <div class="payment">
                         <div class="payment_header">
                            <div class="check"><i class="fa fa-check" aria-hidden="true"></i></div>
                         </div>
                         <div class="content">
                            <h1>Payment Success !</h1>
                            <p>Hey ${name}! Donation succesfull</p>
                            <h4>You have paid : $ ${amount}</h4>
                            Thanks for the payment
                         </div>
                         
                      </div>
                   </div>
                </div>
             </div>
        </body>
        </html>`
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }

            console.log('Message sent: %s', info.messageId);
        });
    });

    res.render('success.ejs', { name: name, email: email,title: process.env.TITLE })
};

