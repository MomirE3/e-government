import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    console.log('GMAIL_USER:', process.env.GMAIL_USER);
    console.log('GMAIL_PASS:', process.env.GMAIL_PASS?.length);
  }

  async sendSurveyInvitation(to: string, token: string) {
    const surveyLink = `${process.env.APP_URL}/surway/fill/${token}`;

    try {
      const info = await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject: 'Poziv za popunjavanje ankete',
        html: `<p>Klikni: <a href="${surveyLink}">${surveyLink}</a></p>`,
      });
      console.log('Email sent:', info.messageId);
    } catch (err) {
      console.error('Mailer error:', err);
      throw err;
    }
  }
}
