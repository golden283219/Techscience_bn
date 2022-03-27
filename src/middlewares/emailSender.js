var aws = require('aws-sdk');

var ses = new aws.SES({region: 'us-east-2'});

async function sendMail(to_email, subject, data) {
    console.log(`sendMail = ${to_email} ${subject} ${data}`);
    const emailParams = {
        Destination: {
            ToAddresses: [to_email],
        },
        Message: {
            Body: {
                Text: { Data: data },
            },
            Subject: { Data: subject },
        },
        Source: "asmall@techscienceonline.com"
    };

    try {
        let key = await ses.sendEmail(emailParams).promise();
        console.log("MAIL SENT SUCCESSFULLY!!");
    } catch (e) {
        console.log("FAILURE IN SENDING MAIL!!", e);
    }
}
