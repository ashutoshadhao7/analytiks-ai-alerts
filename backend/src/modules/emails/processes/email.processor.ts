import { Process, Processor } from '@nestjs/bull';
import { HttpException, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailsService } from '../../emails/emails.service';
import { queueEnum } from 'src/shared/enums/queue.enums';
import { ProcesserIdsEnum } from 'src/shared/enums/processerIds.enum';

@Processor(queueEnum.SendMail)
export class EmailProcessor {
  constructor(private readonly emailsService: EmailsService) {}
  // private readonly logger = new Logger(queueEnum.SendMail);
  @Process(ProcesserIdsEnum.SendMail)
  async sendEmails(job: Job) {
    // this.logger.log(job.data);
    const res = await this.emailsService.sendEmail(job.data);
    if (!res) {
      throw new HttpException(
        'Unable to send email. Please try again later.',
        500,
      );
    }
  }
}
