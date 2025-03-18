import { Injectable, Logger } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { configService } from 'src/config/config.service';

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);
  private slackClient: WebClient;

  constructor() {
    this.slackClient = new WebClient(
      configService.getValue('SLACK_ALERT_TOKEN'),
    );
  }

  // Method to send a plain text message to a specific channel
  async sendMessage(text: string): Promise<void> {
    try {
      if (configService.getValue('NODE_ENV') !== 'local') {
        await this.slackClient.chat.postMessage({
          channel: configService.getValue('SLACK_ALERT_CHANNEL'),
          text,
        });
      }
    } catch (error) {
      this.logger.error('Failed to send message to Slack', error);
    }
  }

  // Method to send a JSON object as a message to a specific channel
  async sendJsonMessage(jsonObject: object): Promise<void> {
    const jsonString = JSON.stringify(jsonObject, null, 2); // Convert JSON object to a formatted string
    try {
      if (configService.getValue('NODE_ENV') !== 'local') {
        await this.slackClient.chat.postMessage({
          channel: configService.getValue('SLACK_ALERT_CHANNEL'),
          text: `\`\`\`${jsonString}\`\`\``,
        }); // Send as a code block
      }
    } catch (error) {
      this.logger.error('Failed to send JSON message to Slack', error);
    }
  }
}
