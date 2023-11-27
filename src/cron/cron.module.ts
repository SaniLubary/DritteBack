import { JournalService } from 'src/journal/journal.service';
import { SendRemindersService } from './send-reminders.service';
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
    SendRemindersService,
    JournalService,
    UserService,
    FirebaseService,
    EncryptionService,
  ],
  exports: [SendRemindersService],
})
export class CronModule {}
