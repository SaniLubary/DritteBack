import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FirebaseService } from 'src/firebase/firebase.service';
import { JournalService } from 'src/journal/journal.service';
import { UserService } from 'src/user/user.service';

const journalFraces = [
  'Lo que más me hizo feliz hoy fue...',
  'Mis metas para esta semana son...',
  'Una lección que aprendí hoy fue...',
  'Mis pensamientos sobre...',
  'Una pequeña victoria de hoy...',
  'Un momento de gratitud por...',
  'Mis preocupaciones actuales son...',
  'Una situación que me desafió fue...',
  'Mis deseos y sueños para el futuro son...',
  'Lo que me inspira hoy es...',
  'Mis sentimientos sobre...',
];

@Injectable()
export class SendRemindersService {
  constructor(
    private readonly journalService: JournalService,
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) {}

  private _randomFrace() {
    const indice = Math.floor(Math.random() * journalFraces.length);
    return journalFraces[indice];
  }

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'send-retrospective-reminder',
  })
  async sendRetrospective() {
    // const sixHoursAgo = new Date();
    // sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
    const tenSecondsAgo = new Date();
    tenSecondsAgo.setSeconds(tenSecondsAgo.getSeconds() - 10);

    const journals =
      await this.journalService.findByHoursAgoUnreminded(tenSecondsAgo);

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
            {
              screen: 'ViewEntry',
              entryToSee: `${journal._id}`,
              notification: {
                title: 'Quieres revisar tu entrada?',
                body: 'Ve la entrada que escribiste hace un rato!',
              },
            },
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

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'send-new-entry-reminder',
  })
  async sendNewEntryReminder() {
    // We want to find users where last entry was X time ago,
    //   to remember them to upload a new one.
    const twentySecondsAgo = new Date();
    twentySecondsAgo.setSeconds(twentySecondsAgo.getSeconds() - 20);
    console.log('Entered new entry reminder');
    const journals = await this.journalService.findByHoursAgo(twentySecondsAgo);

    if (journals.length > 0) {
      let usersToNotify: string[] = journals.map((journal) => journal.userId);

      // only one time each user
      const usersMap = {};
      for (let i = 0; i < usersToNotify.length; i++) {
        usersMap[usersToNotify[i]] = usersMap[usersToNotify[i]]
          ? usersMap[usersToNotify[i]] + 1
          : 1;
      }
      usersToNotify = Object.keys(usersMap);
      console.log('Users to remind -> ', usersToNotify.length);

      for (let i = 0; i < usersToNotify.length; i++) {
        const user = await this.userService.findById(usersToNotify[i]);
        console.log(
          'Reminded for ammount of devices: ',
          user.deviceTokens.length,
        );
        await this.firebaseService.sendNotificationToMultipleTokens(
          user.deviceTokens,
          {
            screen: 'CreateEntry',
            notification: {
              title: 'Hace rato no escribes! Por qué no escribes sobre...',
              body: this._randomFrace(),
            },
          },
        );
      }
    }
  }
}
