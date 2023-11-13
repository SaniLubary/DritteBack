import { JournalService } from 'src/journal/journal.service';
import { SendRetrospectiveReminderService } from './send-retrospective-reminder.service';
import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Journal, JournalSchema } from 'src/journal/schemas/journal.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { EncryptionService } from 'src/encryption/encryption.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Journal.name, schema: JournalSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    SendRetrospectiveReminderService,
    JournalService,
    UserService,
    FirebaseService,
    EncryptionService,
  ],
  exports: [SendRetrospectiveReminderService],
})
export class CronModule {}
