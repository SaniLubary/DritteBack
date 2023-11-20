import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from 'src/auth/auth.service';
import { AchievementService } from 'src/achievement/achievement.service';
import { JournalService } from 'src/journal/journal.service';
import { Journal, JournalSchema } from 'src/journal/schemas/journal.schema';
import {
  Achievement,
  AchievementSchema,
} from 'src/achievement/schemas/achievement.schema';
import { EncryptionService } from 'src/encryption/encryption.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Journal.name, schema: JournalSchema }]),
    MongooseModule.forFeature([
      { name: Achievement.name, schema: AchievementSchema },
    ]),
  ],
  providers: [
    AuthService,
    UserService,
    AchievementService,
    JournalService,
    EncryptionService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
