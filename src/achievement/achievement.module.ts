import { Module } from '@nestjs/common';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Achievement, AchievementSchema } from './schemas/achievement.schema';
import { JournalService } from 'src/journal/journal.service';
import { UserService } from 'src/user/user.service';
import { Journal, JournalSchema } from 'src/journal/schemas/journal.schema';
import { EncryptionService } from 'src/encryption/encryption.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Achievement.name, schema: AchievementSchema },
    ]),
    MongooseModule.forFeature([{ name: Journal.name, schema: JournalSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AchievementController],
  providers: [
    AchievementService,
    JournalService,
    UserService,
    EncryptionService,
    AuthService,
  ],
  exports: [AchievementService],
})
export class AchievementModule {}
