import { Inject, Injectable } from '@nestjs/common';
import { getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FirebaseAdmin') private readonly admin) {}

  async sendNotificationToMultipleTokens(
    tokens: string[],
    entryToSee,
  ): Promise<boolean> {
    if (tokens.length < 500) {
      const message = {
        data: {
          screenToOpen: 'ViewEntry',
          entryToSee: `${entryToSee}`,
        },
        notification: {
          title: 'Quieres revisar tu entrada?',
          body: 'Ve la entrada que escribiste hace un rato!',
        },
        tokens,
      };

      console.log(message);

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
          console.log('Success.. kind of -> ', response);
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
