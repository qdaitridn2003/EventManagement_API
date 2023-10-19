import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { NodeMailerConfigs } from '../configs';
import { Html } from '../constants';

const mailTransporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: NodeMailerConfigs.username,
        pass: NodeMailerConfigs.password,
    },
});

const nodeMailerParty = {
    mailingVerifyAccount: (mail: string, otp: string) => {
        const mailerOptions: Mail.Options = {
            from: NodeMailerConfigs.username,
            to: mail,
            subject: 'Event management application verify account',
            html: Html.verifyHtml(otp),
        };
        mailTransporter.sendMail(mailerOptions, (error, info) => {
            if (error) console.log(`Nodemailer Error ${error}`);
            if (info) console.log(`Nodemailer Info ${info}`);
        });
    },
    mailingResetPassword: (mail: string, otp: string) => {
        const mailerOptions: Mail.Options = {
            from: NodeMailerConfigs.username,
            to: mail,
            subject: 'Event management application reset password',
            html: Html.resetPasswordHtml(otp),
        };
        mailTransporter.sendMail(mailerOptions, (error, info) => {
            if (error) console.log(`Nodemailer Error: ${error}`);
            if (info) console.log(`Nodemailer Info: ${info}`);
        });
    },
};

export default nodeMailerParty;
