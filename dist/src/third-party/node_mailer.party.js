"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const configs_1 = require("../configs");
const constants_1 = require("../constants");
const mailTransporter = nodemailer_1.default.createTransport({
    service: 'hotmail',
    pool: true,
    maxConnections: 10,
    maxMessages: Infinity,
    auth: {
        user: configs_1.NodeMailerConfigs.username,
        pass: configs_1.NodeMailerConfigs.password,
    },
});
const nodeMailerParty = {
    mailingVerifyAccount: (mail, otp) => {
        const mailerOptions = {
            from: configs_1.NodeMailerConfigs.username,
            to: mail,
            subject: 'Event management application verify account',
            html: constants_1.Html.verifyHtml(otp),
        };
        mailTransporter.sendMail(mailerOptions, (error, info) => {
            if (error)
                console.log(`Nodemailer Error ${error}`);
            if (info)
                console.log(`Nodemailer Info ${info}`);
        });
    },
    mailingResetPassword: (mail, otp) => {
        const mailerOptions = {
            from: configs_1.NodeMailerConfigs.username,
            to: mail,
            subject: 'Event management application reset password',
            html: constants_1.Html.resetPasswordHtml(otp),
        };
        mailTransporter.sendMail(mailerOptions, (error, info) => {
            if (error)
                console.log(`Nodemailer Error: ${error}`);
            if (info)
                console.log(`Nodemailer Info: ${info}`);
        });
    },
};
exports.default = nodeMailerParty;
