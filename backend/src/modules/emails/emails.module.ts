import { Global, Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { BullModule } from '@nestjs/bull';
import { queueEnum } from 'src/shared/enums/queue.enums';
import { EmailProcessor } from './processes/email.processor';

@Global()
@Module({
  imports: [
    BullModule,
    BullModule.registerQueue({
      name: queueEnum.SendMail,
    }),
  ],
  providers: [EmailsService, EmailProcessor],
  exports: [EmailsService],
})
export class EmailsModule {}
