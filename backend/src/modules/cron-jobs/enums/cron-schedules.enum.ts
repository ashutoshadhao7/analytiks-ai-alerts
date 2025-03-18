export enum CronSchedulesEnum {
  EVERY_SECOND = '* * * * * *',
  EVERY_FIVE_SECONDS = '*/5 * * * * *',
  EVERY_MINUTE = '* * * * *',
  EVERY_FIVE_MINUTES = '*/5 * * * *',
  EVERY_HOUR = '0 * * * *',
  MIDNIGHT = '0 0 * * *', // 12 AM EST
  NOON = '0 12 * * *', // 12 PM EST
  EVERY_DAY_AT_6_AM = '0 6 * * *',
  EVERY_MONDAY_AT_9_AM = '0 9 * * 1',
  FIRST_DAY_OF_MONTH = '0 0 1 * *',
}
