const AWS = require('aws-sdk');

exports.handler = async function (event) {
    console.log(JSON.stringify(event));
    const notificationMessage = JSON.parse(event.Records[0].body);
    const { members, mechanism, subject, text } = notificationMessage;
    console.log(`there are ${members.length} recipients.`);
    if (mechanism === 'TEXT') {
        console.log('Trackboss messaging lambda - starting text messages');
        // send a message directly through SNS to each phone number.
        const sns = new AWS.SNS({ region: 'us-east-1' });
        for (const member of members) {
          try {
            const snsResponse = await sns.publish({
                PhoneNumber: member.phone,
                Message: text,
                MessageAttributes: {
                    'AWS.SNS.SMS.SMSType': { DataType: 'String', StringValue: 'Promotional' },
                    'AWS.SNS.SMS.SenderID': { DataType: 'String', StringValue: 'PRA-Hogback' },
                  }
            }).promise();
            console.log(`publishing to ${member.phone}`);
          } catch (error) {
            console.error('Trackboss messaging lambda - unable to send message', error);
          }
        }
        console.log(`Trackboss messaging lambda - sent to ${members.length} recipients`);
    } else if (mechanism === 'EMAIL') {
        console.log('Trackboss messaging lambda - sending an email message');
        // send a message directly through SES to each email address as a BCC.
        const memberRecipients = [];
        for (const member of members) {
            memberRecipients.push(member.email);
        }
        const ses = new AWS.SES();
        const emailParams = {
            Destination: {
                ToAddresses: ['hogbacksecretary@gmail.com'],
                BccAddresses: memberRecipients,
            },
            Message: {
                Subject: { Data: subject },
                Body: {
                    Text: {
                        Charset: 'UTF-8',
                        Data: text,
                    },
                },
            },
            ReplyToAddresses: ['hogbacksecretary@gmail.com'],
            Source: 'admin@palmyramx.com',
        };
        try {
            const sesResponse = await ses.sendEmail(emailParams).promise();
            console.log(`Trackboss messaging lambda - sent email to ${memberRecipients.length} members`);
        } catch (error) {
            console.error('Trackboss messaging lambda - Unable to send email via SES');
            console.error(error);
        }
    }
};
