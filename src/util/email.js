var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.sociofy@gmail.com',
        pass: 'QxetGJgutqCYESqPXQpLTTc6C0iOe0RD8SEUBMUOMcPUyLx70Vs1cSk8xDhv'
    }
});

module.exports = {
    registered: async (username, email, activityName) => {
        const htmlData = 
            '<p>Dear ' + username + ',</p>\
            <p>Sociofy is pleased to announce that you has <font color="red">registered</font> to join in <font color="red">' + activityName + '</font>.</p>\
            <p>Best regards,<br/>\
            Sociofy team<br/>\
            Website: http://localhost:3000</p>'

        const mailOptions = {
            from: '"Sociofy" noreply.sociofy@gmail.com',
            to: email,
            //cc: 'madddogite01@gmail.com',
            subject: 'Sociofy: New registration',
            //text: 'Plaintext version of the message',
            html: htmlData
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.log(error);
            else console.log('Email sent: ' + info.response);
        });
    },

    // cancel: async (username, email, activityName) => {
    //     const htmlData = 
    //         '<p>Dear ' + username + ',</p>\
    //         <p>Sociofy is pleased to announce that you has <font color="red">canceled</font> to join in ' + activityName + '.</p>\
    //         <p>Best regards,<br/>\
    //         Sociofy team<br/>\
    //         Website: http://localhost:3000</p>'

    //     const mailOptions = {
    //         from: '"Sociofy" noreply.sociofy@gmail.com',
    //         to: email,
    //         //cc: 'madddogite01@gmail.com',
    //         subject: 'Sociofy: Canceled',
    //         //text: 'Plaintext version of the message',
    //         html: htmlData
    //     };
    
    //     transporter.sendMail(mailOptions, function (error, info) {
    //         if (error) console.log(error);
    //         else console.log('Email sent: ' + info.response);
    //     });
    // },

    remind: async (username, email, activityName, time, link) => {
        const htmlData = 
            '<p>Dear ' + username + ',</p>\
            <p>Sociofy is pleased to announce that you has <font color="red">canceled</font> to join in ' + activityName + '.</p>\
            <p>Best regards,<br/>\
            Sociofy team<br/>\
            Website: http://localhost:3000</p>'

        const mailOptions = {
            from: '"Sociofy" noreply.sociofy@gmail.com',
            to: email,
            //cc: 'madddogite01@gmail.com',
            subject: 'Sociofy: Canceled',
            //text: 'Plaintext version of the message',
            html: htmlData
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.log(error);
            else console.log('Email sent: ' + info.response);
        });
    }

}



