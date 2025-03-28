import { Body, Controller, Get, Post } from '@nestjs/common';
import { CronJobsService } from './cron-jobs.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('corn-job')
@ApiTags('Cron Jobs')
export class CronJobsController {
  constructor(private readonly cornJobsService: CronJobsService) {}

  @Get()
  sendEmailAlerts() {
    return this.cornJobsService.sendEmailAlerts();
  }

  @Post()
  webhook(@Body() body: any) {
    return this.cornJobsService.testHook(body);
  }

  @Get('test')
  test() {
    return this.cornJobsService.getUsers();
  }
}
