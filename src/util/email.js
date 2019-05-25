var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.sociofy@gmail.com',
        pass: 'QxetGJgutqCYESqPXQpLTTc6C0iOe0RD8SEUBMUOMcPUyLx70Vs1cSk8xDhv'
    }
});

module.exports = {
    registered: async (username, email, activityName, link) => {
        const htmlData =
            '<p>Dear ' + username + ',</p>\
            <p>Sociofy is pleased to announce that you has been <font color="green">accept</font> to join in <font color="red">' + activityName + '</font>.<br>\
            Detail: ' + link + '</p>\
            <p>Best regards,<br/>\
            Sociofy team<br/>\
            Website: http://localhost:3000</p>'

        const mailOptions = {
            from: '"Sociofy" noreply.sociofy@gmail.com',
            to: email,
            subject: 'Sociofy: New registration',
            html: htmlData
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.log(error);
            else console.log('Email sent: ' + info.response);
        });
    },
    refused: async (username, email, activityName, link) => {
        const htmlData =
            '<p>Dear ' + username + ',</p>\
            <p>Sociofy is pleased to announce that you has been <font color="red">rejected</font> to join in <font color="red">' + activityName + '</font>.<br>\
            Detail: ' + link + '</p>\
            <p>Best regards,<br/>\
            Sociofy team<br/>\
            Website: http://localhost:3000</p>'

        const mailOptions = {
            from: '"Sociofy" noreply.sociofy@gmail.com',
            to: email,
            subject: 'Sociofy: New registration',
            html: htmlData
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.log(error);
            else console.log('Email sent: ' + info.response);
        });
    },
    remind: async (username, email, activityName, time, link) => {
        const htmlData =
            '<p>Dear ' + username + ',</p>\
            <p>Sociofy is pleased to announce that you activity <font color="red"> '+ activityName +' </font> will be held on tomorrow ( '+ time + ')</p>\
            <p>Best regards,<br/>\
            Sociofy team<br/>\
            Website: http://localhost:3000</p>'

        const mailOptions = {
            from: '"Sociofy" noreply.sociofy@gmail.com',
            to: email,
            subject: 'Sociofy: Remind',
            html: htmlData
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.log(error);
            else console.log('Email sent: ' + info.response);
        });
    }

}