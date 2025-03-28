import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronSchedulesEnum } from './enums/cron-schedules.enum';
import { HasuraService } from '../hasura/hasura.service';
import { GetVisitsByDay } from '../hasura/gql/interfaces/variables.interface';
import { subWeeks, startOfWeek, endOfWeek, format } from 'date-fns';
import {
  BrandWithLocationResponse,
  LocationData,
} from '../hasura/gql/interfaces/query-output.interface';
import { DifferenceInterface } from './interfaces/difference-data.interface';
import { DateTime } from 'luxon';
import { emit } from 'process';
import { EmailDataInterface } from '../emails/interface/email-data.interface';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class CronJobsService {
  constructor(
    private readonly hasuraService: HasuraService,
    private readonly emailService: EmailsService,
  ) {}
  @Cron(CronSchedulesEnum.MIDNIGHT, { timeZone: 'America/New_York' })
  // @Cron(CronSchedulesEnum.EVERY_SECOND) // Run every sec  ( for testing purposes only )
  async sendEmailAlerts() {
    const brands: BrandWithLocationResponse =
      await this.hasuraService.getBrandsWithLocations();
    let cnt = 0;
    let loopLength = 0;
    for (const brand of brands.brandList) {
      if(cnt) break;
      // console.log('starting cron job');
      // if (!brand.hasAlerts) continue;
      const differences: DifferenceInterface[] = [];
      for (const location of brand.locations) {
        loopLength++;
        const { from, to, from2, to2 } = this.getWeekComparisonDates();
        const variables: GetVisitsByDay = {
          id: location.id,
          id2: location.id,
          from,
          to,
          from2,
          to2,
        };
        console.log('variables', variables);
        const brandId = brand.id;
        const data =
          await this.hasuraService.getVisitsByDayWithComparison(variables);
        const compare = this.compareAndNotify(
          data,
          // brand.alertsDeviationThreshold,
          1,
        );
        if (compare) {
          differences.push(compare);
        }
      }
      if (differences.length > 0) {
        cnt++;
        // console.log('difference found', differences);
        // const { userList } = await this.hasuraService.getUsersWithBrandId(
        //   brand.id,
        // );
        // if (userList.length > 0) {
        // const user = userList[0];

        const csvContent = this.getFile(differences, brand.name);
        const csvBase64 = Buffer.from(csvContent).toString('base64');
        const emailData: EmailDataInterface = {
          // to: user.email,
          to: 'ashutosh.adhao@infillion.com',
          from: {
            name: 'Presence Analytics',
            email: 'it@analytiks.ai', // TODO: Need to change this
          },
          subject: 'Alerts for your locations',
          text: `Please find the attached CSV file for the locations with deviations.`,
          attachments: [
            {
              content: csvBase64,
              filename: 'data.csv',
              type: 'text/csv',
              disposition: 'attachment',
            },
          ],
        };
        const res = await this.emailService.addEmailToQueue(emailData);
        console.log('Email sent:', emailData);
        // }
      }
    }
    console.log('cron job completed', cnt);
    return {
      loopLength: loopLength,
      brands: brands.brandList.length,
      locations: brands.brandList
        .map((brand) => brand.locations.length)
        .reduce((a, b) => a + b, 0),
    };
  }

  getWeekComparisonDates(): {
    from: string;
    to: string;
    from2: string;
    to2: string;
  } {
    const now = new Date();

    // Get the current week's start and end dates (Sunday to Saturday)
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
    const currentWeekEnd = endOfWeek(now, { weekStartsOn: 0 }); // Saturday

    // Get last week's start and end dates
    const lastWeekStart = subWeeks(currentWeekStart, 1);
    const lastWeekEnd = subWeeks(currentWeekEnd, 1);

    return {
      from: format(currentWeekStart, 'yyyy-MM-dd'),
      to: format(currentWeekEnd, 'yyyy-MM-dd'),
      from2: format(lastWeekStart, 'yyyy-MM-dd'),
      to2: format(lastWeekEnd, 'yyyy-MM-dd'),
    };
  }

  compareAndNotify(
    data: LocationData,
    threshold: number,
  ): DifferenceInterface | null {
    const currentDate = DateTime.now()
      .setZone('America/New_York')
      .toFormat('cccc');

    console.log({ currentDate });

    const currentWeek = data.location.presenceAnalytics.visitsByDay.dataPoints;
    const previousWeek =
      data.locationComparison.presenceAnalytics.visitsByDay.dataPoints;

    // console.log('Data Received:', data.location.presenceAnalytics.visitsByDay);
    // console.log('Current Week:', currentWeek);
    // console.log('Previous Week:', previousWeek);
    let difference: DifferenceInterface | null = null;

    const currentDayData = currentWeek.find(
      (entry) => entry.key === currentDate,
    );
    const previousDayData = previousWeek.find(
      (entry) => entry.key === currentDate,
    );

    console.log('Current Day Data:', currentDayData);
    console.log('Previous Day Data:', previousDayData);

    if (currentDayData && previousDayData) {
      const division =
        (Math.abs(currentDayData.value - previousDayData.value) /
          (previousDayData.value + 1)) *
        100;
      const direction =
        currentDayData.value > previousDayData.value ? 'Positive' : 'Negative';

      console.log('Division:', division);
      console.log('Threshold:', threshold);

      if (division > threshold) {
        difference = {
          previousWeek: previousDayData.value,
          currentWeek: currentDayData.value,
          division: parseFloat(division.toFixed(2)),
          direction,
          location: data.location.name,
        };
      }
    }

    return difference;
  }

  testHook(data: any) {
    console.log(data);
    console.log(`Hook received successfully ${new Date().toISOString()}`);
  }

  getUsers() {
    return this.hasuraService.getUsersWithBrandId(10);
  }

  getFile(differences: DifferenceInterface[], brand: string) {
    const data = differences.map((diff) => {
      return {
        'Brand Name': brand,
        Location: diff.location,
        'Previous Week': diff.previousWeek,
        'Current Week': diff.currentWeek,
        'Difference (%)': diff.division,
        Direction: diff.direction,
      };
    });

    const csv = this.convertToCSV(data);
    return csv;
  }
  convertToCSV(data: any[]): string {
    if (!data.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((obj) => Object.values(obj).join(','));
    return [headers, ...rows].join('\n');
  }
}
