import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Journal, JournalSchema } from './schemas/journal.schema';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Journal.name, schema: JournalSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [JournalController],
  providers: [JournalService, EncryptionService, UserService, AuthService],
})
export class JournalModule {}
