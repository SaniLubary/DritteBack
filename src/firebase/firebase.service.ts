import { Inject, Injectable } from '@nestjs/common';
import { getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FirebaseAdmin') private readonly admin) {}

  async sendNotificationToMultipleTokens(
    tokens: string[],
    options: {
      screen: string;
      entryToSee?: string;
      notification: { title: string; body: string };
    },
  ): Promise<boolean> {
    console.log('Options => ', options);
    if (tokens.length < 500) {
      const message = {
        data: {
          screenToOpen: options.screen,
          entryToSee: options.entryToSee || '',
        },
        notification: {
          title: options.notification.title,
          body: options.notification.body,
        },
        tokens,
      };

      return getMessaging()
        .sendEachForMulticast(message)
        .then((response) => {
          if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
              if (!resp.success) {
                failedTokens.push(tokens[idx]);
              }
            });
            console.log('List of tokens that caused failures: ' + failedTokens);
          }
          console.log('Success -> ', response);
          return true;
        })
        .catch((error) => {
          console.log('Error sending message:', error);
          return false;
        });
    } else {
      throw new Error(
        "Can't send notification to more than 500 tokens at a time",
      );
    }
  }
}
