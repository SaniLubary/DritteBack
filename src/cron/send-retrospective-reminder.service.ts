import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FirebaseService } from 'src/firebase/firebase.service';
import { JournalService } from 'src/journal/journal.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SendRetrospectiveReminderService {
  constructor(
    private readonly journalService: JournalService,
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'send-retrospective-reminder',
  })
  async checkEntries() {
    // const sixHoursAgo = new Date();
    // sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
    const tenSecondsAgo = new Date();
    tenSecondsAgo.setSeconds(tenSecondsAgo.getSeconds() - 10);

    const journals = await this.journalService.findByHoursAgo(tenSecondsAgo);

    if (journals.length > 0) {
      const usersToNotify: string[] = journals.map((journal) => journal.userId);
      console.log(
        'Journals to remind -> ',
        journals.length,
        ' For ammmount of users -> ',
        usersToNotify.length,
      );

      for (let i = 0; i < journals.length; i++) {
        const journal = journals[i];
        const user = await this.userService.findById(usersToNotify[i]);
        console.log(
          'Journal: ',
          journal.title,
          'Reminded for ammount of devices: ',
          user.deviceTokens.length,
        );
        const response =
          await this.firebaseService.sendNotificationToMultipleTokens(
            user.deviceTokens,
            journal._id,
          );
        journal.reminded = true;
        response &&
          this.journalService.upsertJournal({
            ...journal,
            userEmail: user.email,
          });
      }
    }
  }
}
