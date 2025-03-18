import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { configService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronJobsModule } from './modules/cron-jobs/cron-jobs.module';
import { SlackModule } from './modules/slack/slack.module';
import { EmailsModule } from './modules/emails/emails.module';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { HasuraModule } from './modules/hasura/hasura.module';
@Module({
  imports: [
    MulterModule.register({
      limits: { fieldSize: 20971520, fileSize: 20971520 },
    }),
    // TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    BullModule.forRoot({
      redis: {
        host: configService.getValue('REDIS_HOST'),
        port: Number(configService.getValue('REDIS_PORT')),
        password: configService.getValue('REDIS_PASSWORD'),
      },
    }),
    ScheduleModule.forRoot(),
    CronJobsModule,
    SlackModule,
    EmailsModule,
    HasuraModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
