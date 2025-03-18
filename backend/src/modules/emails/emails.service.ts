import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { configService } from 'src/config/config.service';
import * as sgMail from '@sendgrid/mail';
import { EmailDataInterface } from './interface/email-data.interface';
import { InjectQueue } from '@nestjs/bull';
import { queueEnum } from 'src/shared/enums/queue.enums';
import { ProcesserIdsEnum } from 'src/shared/enums/processerIds.enum';
import { Queue } from 'bullmq';

@Injectable()
export class EmailsService {
  private readonly apiKey: string;

  constructor(
    @InjectQueue(queueEnum.SendMail) private readonly emailQueue: Queue,
  ) {
    this.apiKey = configService.getValue('SENDGRID_API_KEY');
    sgMail.setApiKey(this.apiKey); // Initialize SendGrid API key once
  }

  // Send email directly
  async sendEmail(emailData: EmailDataInterface) {
    const mailData: sgMail.MailDataRequired = {
      to: emailData.to,
      from: {
        name: emailData?.from?.name || 'Analytiks AI',
        email:
          emailData?.from?.email ||
          configService.getValue('SENDGRID_FROM_ADDRESS'),
      },
      subject: emailData.subject || 'No Subject Provided',
      content: [
        {
          type: 'text/plain',
          value: emailData.text || 'No text provided',
        },
      ], // Initialize content array
      templateId: emailData.templateId, // Optional templateId
      dynamicTemplateData: emailData.dynamicTemplateData, // Optional dynamic data for the template
    };

    try {
      const res = await sgMail.send(mailData);
      return res;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new HttpException(
        'Unable to send email. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Add email to queue
  async addEmailToQueue(emailData: EmailDataInterface): Promise<void> {
    try {
      await this.emailQueue.add(
        ProcesserIdsEnum.SendMail,
        emailData, // Pass the email data directly
        {
          removeOnComplete: true,
          priority: 10, // High priority
        },
      );
      // console.log(`Email queued successfully for ${emailData.to}`);
    } catch (error) {
      console.error('Error adding email to queue:', error);
      throw new HttpException(
        'Unable to queue email. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
